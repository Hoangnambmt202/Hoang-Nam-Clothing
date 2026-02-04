import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class ShippingAddressDto {
  @IsNotEmpty()
  @IsString()
  recipientName: string; // Tên người nhận

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  // @IsPhoneNumber('VN') // Nếu muốn validate số VN chuẩn
  phone: string;

  @IsNotEmpty()
  @IsString()
  addressLine: string; // Số nhà, tên đường

  @IsNotEmpty()
  @IsString()
  ward: string; // Phường/Xã

  @IsNotEmpty()
  @IsString()
  district: string; // Quận/Huyện

  @IsNotEmpty()
  @IsString()
  province: string; // Tỉnh/Thành phố
}
