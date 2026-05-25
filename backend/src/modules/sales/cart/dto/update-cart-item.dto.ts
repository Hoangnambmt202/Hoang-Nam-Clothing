import { IsInt, Min, IsOptional, IsUUID } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsUUID()
  @IsOptional()
  newVariantId?: string;
}
