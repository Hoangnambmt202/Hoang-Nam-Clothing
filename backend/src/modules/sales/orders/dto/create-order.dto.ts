import {
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingAddressDto } from '@/modules/shipping/dto/shipping_address.dto';

export class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;
  // LƯU Ý: Ở Service bạn đang query bảng Variant theo ID này,
  // nên Frontend cần gửi lên ID của Variant (SKU), không phải ID Product cha.

  @IsNumber()
  @Min(1)
  quantity: number;

  // Size và Color ở đây chỉ mang tính chất Snapshot (lưu lại lúc mua)
  // Vì ID ở trên đã là Variant cụ thể rồi.
  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // 1. Sửa từ String thành Object để khớp với cột type: 'json' trong Entity
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  // 2. Thêm trường này để chọn phương thức vận chuyển
  @IsNotEmpty()
  @IsUUID()
  shippingMethodId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
