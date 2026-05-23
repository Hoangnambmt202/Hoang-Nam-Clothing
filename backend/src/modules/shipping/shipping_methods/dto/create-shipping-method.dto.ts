import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingMethodDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  baseCost: number;

  @IsOptional()
  @IsNumber()
  estimatedDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
