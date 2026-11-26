import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ContentModule } from './content/content.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ServicesCatalogModule } from './services-catalog/services-catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI
          ?? `mongodb://${process.env.MONGO_HOST ?? '127.0.0.1'}:27017/car-doctor`,
      }),
    }),
    AuthModule,
    ProductsModule,
    ServicesCatalogModule,
    ContentModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}