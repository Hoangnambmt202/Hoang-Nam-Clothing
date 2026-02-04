import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateUserDto extends PartialType(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {}
