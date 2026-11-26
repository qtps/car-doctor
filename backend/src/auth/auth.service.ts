import {
  ConflictException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

export type OAuthProvider = 'google' | 'facebook';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    private readonly jwt: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;
    const email = process.env.DEMO_ADMIN_EMAIL ?? 'admin@cardoctor.demo';
    const password = process.env.DEMO_ADMIN_PASSWORD ?? 'Admin123!';
    const exists = await this.users.exists({ email: email.toLowerCase() });
    if (!exists) {
      await this.users.create({
        name: 'Car Doctor Admin',
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: 'admin',
      });
    }
  }

  async signup(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.users.exists({ email: normalizedEmail })) {
      throw new ConflictException('An account with this email already exists');
    }
    const user = await this.users.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    });
    return this.createSession(user);
  }

  async login(email: string, password: string) {
    const user = await this.users
      .findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash');
    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return this.createSession(user);
  }

  async createSession(user: UserDocument) {
    const safeUser = this.toSafeUser(user);
    const accessToken = await this.jwt.signAsync({
      sub: String(user._id),
      email: safeUser.email,
      name: safeUser.name,
      role: safeUser.role,
    });
    return { accessToken, user: safeUser };
  }

  async findOrCreateOAuthUser(
    provider: OAuthProvider,
    profile: { id: string; email: string; name: string },
  ) {
    const email = profile.email.trim().toLowerCase();
    let user = await this.users.findOne({ provider, providerId: profile.id });
    if (!user) {
      user = await this.users.findOne({ email });
      if (user && user.providerId && user.providerId !== profile.id) {
        throw new ConflictException('This email is already linked to another sign-in method');
      }
      if (user) {
        user.provider = provider;
        user.providerId = profile.id;
        await user.save();
      } else {
        user = await this.users.create({
          name: profile.name,
          email,
          provider,
          providerId: profile.id,
        });
      }
    }
    return user;
  }

  async getProfile(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new UnauthorizedException('Account no longer exists');
    return this.toSafeUser(user);
  }

  private toSafeUser(user: UserDocument) {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };
  }

  getProviderAuthorizationUrl(provider: OAuthProvider, state: string) {
    if (provider === 'google') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) throw new NotImplementedException('Google sign-in is not configured yet');
      const redirectUri = this.getRedirectUri(provider);
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.search = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        prompt: 'select_account',
      }).toString();
      return url.toString();
    }

    const appId = process.env.FACEBOOK_APP_ID;
    if (!appId) throw new NotImplementedException('Facebook sign-in is not configured yet');
    const url = new URL('https://www.facebook.com/v21.0/dialog/oauth');
    url.search = new URLSearchParams({
      client_id: appId,
      redirect_uri: this.getRedirectUri(provider),
      response_type: 'code',
      scope: 'email,public_profile',
      state,
    }).toString();
    return url.toString();
  }

  async resolveOAuthProfile(provider: OAuthProvider, code: string) {
    const redirectUri = this.getRedirectUri(provider);
    let tokenEndpoint: string;
    let tokenParams: URLSearchParams;
    if (provider === 'google') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new NotImplementedException('Google sign-in is not configured yet');
      }
      tokenEndpoint = 'https://oauth2.googleapis.com/token';
      tokenParams = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      });
    } else {
      const appId = process.env.FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;
      if (!appId || !appSecret) {
        throw new NotImplementedException('Facebook sign-in is not configured yet');
      }
      tokenEndpoint = 'https://graph.facebook.com/v21.0/oauth/access_token';
      tokenParams = new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        code,
        redirect_uri: redirectUri,
      });
    }

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    });
    if (!tokenResponse.ok) throw new UnauthorizedException('Social sign-in could not be verified');
    const token = (await tokenResponse.json()) as { access_token?: string };
    if (!token.access_token) throw new UnauthorizedException('Social provider returned no access token');

    const profileUrl = provider === 'google'
      ? 'https://openidconnect.googleapis.com/v1/userinfo'
      : 'https://graph.facebook.com/me?fields=id,name,email';
    const profileResponse = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!profileResponse.ok) throw new UnauthorizedException('Social profile could not be verified');
    const profile = (await profileResponse.json()) as {
      id?: string;
      sub?: string;
      email?: string;
      email_verified?: boolean;
      name?: string;
    };
    const id = profile.sub ?? profile.id;
    if (!id || !profile.email || !profile.name || (provider === 'google' && profile.email_verified !== true)) {
      throw new UnauthorizedException('Social account must provide a verified email and name');
    }
    return { id, email: profile.email, name: profile.name };
  }

  private getRedirectUri(provider: OAuthProvider) {
    const backendUrl = process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;
    return `${backendUrl.replace(/\/$/, '')}/api/auth/${provider}/callback`;
  }
}