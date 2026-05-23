import {
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingAddressDto } from '@/modules/shipping/dto/shipping_address.dto';
import { OrderItemDto } from './create-order.dto';

export class GuestInfoDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => GuestInfoDto)
  guestInfo?: GuestInfoDto;

  @IsNotEmpty()
  @IsString()
  shippingMethodId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
