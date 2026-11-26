import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());
  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.use('/api/auth/login', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { statusCode: 429, message: 'Too many sign-in attempts. Please try again later.' },
  }));
  app.use('/api/auth/signup', rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { statusCode: 429, message: 'Too many sign-up attempts. Please try again later.' },
  }));
  app.use('/api/orders', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (request) => request.method !== 'POST',
    message: { statusCode: 429, message: 'Too many order requests. Please try again later.' },
  }));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(Number(process.env.PORT ?? 5000), '0.0.0.0');
}

void bootstrap();