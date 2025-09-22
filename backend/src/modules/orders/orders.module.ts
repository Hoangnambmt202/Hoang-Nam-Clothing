import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '@modules/products/entities/product.entity';
import { ProductsModule } from '@modules/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]), // 🟢 đăng ký repo
    ProductsModule, // 🟢 để inject ProductsService
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
