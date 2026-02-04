import { User } from '@/modules/users/entities/users.entity';
import { IsString } from 'class-validator';

export class AuthResponseDto {
  access_token: string;
  user: Partial<User>;
  expires_in: number;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}
