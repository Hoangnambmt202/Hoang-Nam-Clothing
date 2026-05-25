import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email: string;
  };
}

@Controller('user/addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.addressService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.addressService.findOne(id, req.user.id);
  }

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createAddressDto: any) {
    return this.addressService.create(req.user.id, createAddressDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateAddressDto: any,
  ) {
    return this.addressService.update(id, req.user.id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.addressService.remove(id, req.user.id);
  }
}
