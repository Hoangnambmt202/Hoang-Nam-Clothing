import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { CartModule } from './modules/sales/cart/cart.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/sales/orders/orders.module';
import { CategoriesModule } from './modules/catalog/categories/categories.module';
import { ProductsModule } from './modules/catalog/products/products.module';
import { BrandsModule } from './modules/catalog/brands/brands.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { PaymentTransactionsModule } from './modules/payments/payment_transactions/payment_transactions.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SeedModule } from './database/seeds/seed.module';
import { UsersController } from './modules/users/user.controller';
import { ProductsController } from './modules/catalog/products/products.controller';
import { CategoriesController } from './modules/catalog/categories/categories.controller';
import { AuthController } from './modules/auth/auth.controller';
import { BrandsController } from './modules/catalog/brands/brands.controller';
import { OrdersController } from './modules/sales/orders/orders.controller';
import { FilesModule } from './modules/files/files.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ShippingMethodsModule } from './modules/shipping/shipping_methods/shipping_methods.module';
import { AddressModule } from './modules/shipping/addresss/address.module';
import { SystemLogsModule } from './modules/system-logs/system-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    AuthModule,
    BrandsModule,
    CartModule,
    OrdersModule,
    FilesModule,
    PaymentsModule,
    ShippingMethodsModule,
    AddressModule,
    SystemLogsModule,
    WishlistsModule,
    ReviewsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    ProductsController,
    CategoriesController,
    AuthController,
    BrandsController,
    OrdersController,
  ],
  providers: [AppService],
})
export class AppModule {}
