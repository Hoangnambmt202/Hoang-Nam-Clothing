import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShippingMethod } from './entities/shipping_methods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingMethod])],
  providers: [],
  exports: [TypeOrmModule],
})
export class ShippingMethodsModule {}
