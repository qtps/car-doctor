import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { Request, Response } from 'express';
import { AuthenticatedUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthService, OAuthProvider } from './auth.service';

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.auth.signup(dto.name, dto.email, dto.password);
    response.cookie('car_doctor_session', session.accessToken, cookieOptions());
    return { user: session.user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.auth.login(dto.email, dto.password);
    response.cookie('car_doctor_session', session.accessToken, cookieOptions());
    return { user: session.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('car_doctor_session', { path: '/' });
    return { message: 'Signed out' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    return { user: await this.auth.getProfile(user.sub) };
  }

  @Get(':provider')
  startOAuth(
    @Param('provider') providerParam: string,
    @Res() response: Response,
  ) {
    const provider = this.validateProvider(providerParam);
    const state = randomBytes(32).toString('hex');
    response.cookie('oauth_state', state, {
      ...cookieOptions(),
      maxAge: 5 * 60 * 1000,
    });
    return response.redirect(this.auth.getProviderAuthorizationUrl(provider, state));
  }

  @Get(':provider/callback')
  async finishOAuth(
    @Param('provider') providerParam: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const provider = this.validateProvider(providerParam);
    const expectedState = request.cookies?.oauth_state as string | undefined;
    response.clearCookie('oauth_state', { path: '/' });
    if (!expectedState || !state || state !== expectedState) {
      throw new UnauthorizedException('Social sign-in verification expired; please try again');
    }
    if (!code) throw new UnauthorizedException('Social provider did not return an authorization code');
    const profile = await this.auth.resolveOAuthProfile(provider, code);
    const user = await this.auth.findOrCreateOAuthUser(provider, profile);
    const session = await this.auth.createSession(user);
    response.cookie('car_doctor_session', session.accessToken, cookieOptions());
    return response.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/callback`);
  }

  private validateProvider(value: string): OAuthProvider {
    if (value !== 'google' && value !== 'facebook') {
      throw new UnauthorizedException('Unsupported social sign-in provider');
    }
    return value;
  }
}