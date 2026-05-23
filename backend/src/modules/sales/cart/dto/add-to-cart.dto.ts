import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsUUID } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsOptional()
  productVariantId?: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
