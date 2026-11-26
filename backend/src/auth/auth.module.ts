import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { getJwtSecret } from '../common/security/jwt-secret';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

function getJwtExpiration(): SignOptions['expiresIn'] {
  const value = process.env.JWT_EXPIRES_IN ?? '7d';
  if (!/^\d+(ms|[smhdwy])$/.test(value)) {
    throw new Error('JWT_EXPIRES_IN must be a duration such as 15m or 7d');
  }
  return value as SignOptions['expiresIn'];
}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: getJwtExpiration() },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}