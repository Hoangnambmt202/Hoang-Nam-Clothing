import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShippingMethod } from './entities/shipping_methods.entity';
import { ShippingMethodsController } from './shipping_methods.controller';
import { ShippingMethodsService } from './shipping_methods.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingMethod])],
  controllers: [ShippingMethodsController],
  providers: [ShippingMethodsService],
  exports: [ShippingMethodsService],
})
export class ShippingMethodsModule {}
