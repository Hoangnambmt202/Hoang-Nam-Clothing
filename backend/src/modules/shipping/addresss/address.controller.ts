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
  async findAll(@Request() req: AuthenticatedRequest) {
    const data = await this.addressService.findAll(req.user.id);
    return { success: true, message: 'Addresses retrieved successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const data = await this.addressService.findOne(id, req.user.id);
    return { success: true, message: 'Address retrieved successfully', data };
  }

  @Post()
  async create(@Request() req: AuthenticatedRequest, @Body() createAddressDto: any) {
    const data = await this.addressService.create(req.user.id, createAddressDto);
    return { success: true, message: 'Address created successfully', data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateAddressDto: any,
  ) {
    const data = await this.addressService.update(id, req.user.id, updateAddressDto);
    return { success: true, message: 'Address updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    await this.addressService.remove(id, req.user.id);
    return { success: true, message: 'Address deleted successfully', data: null };
  }
}
