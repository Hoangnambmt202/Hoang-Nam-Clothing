// dto/create-image.dto.ts
import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateImageDto {
  @IsUUID()
  productId: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsBoolean()
  is_thumbnail?: boolean;
}
