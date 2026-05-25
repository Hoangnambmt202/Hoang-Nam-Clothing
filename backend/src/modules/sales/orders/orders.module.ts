import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';
import { ProductsModule } from '@/modules/catalog/products/products.module';
import { ShippingMethodsModule } from '@/modules/shipping/shipping_methods/shipping_methods.module';
import { UsersModule } from '@/modules/users/users.module';
import { CartModule } from '@/modules/sales/cart/cart.module';
import { PaymentTransaction } from '@/modules/payments/payment_transactions/entities/payment_transaction.entity';
import { ShippingMethod } from '@/modules/shipping/shipping_methods/entities/shipping_methods.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, ProductVariant, PaymentTransaction, ShippingMethod]),
    ProductsModule,
    ShippingMethodsModule,
    UsersModule,
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
