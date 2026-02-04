import { Module } from '@nestjs/common';
import { AddressModule } from '../shipping/addresss/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UsersService } from './user.service';

@Module({
  imports: [AddressModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
