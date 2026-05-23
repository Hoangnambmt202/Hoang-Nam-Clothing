import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ShippingMethodsService } from './shipping_methods.service';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { Public } from '@/common/decorators/public.decorator';

@Controller('shipping-methods')
export class ShippingMethodsController {
  constructor(private readonly shippingMethodsService: ShippingMethodsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createDto: CreateShippingMethodDto) {
    return this.shippingMethodsService.create(createDto);
  }

  @Public()
  @Get()
  findAll(@Query('activeOnly') activeOnly?: string) {
    const isActiveOnly = activeOnly === 'true';
    return this.shippingMethodsService.findAll(isActiveOnly);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingMethodsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateShippingMethodDto) {
    return this.shippingMethodsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.shippingMethodsService.remove(id);
  }
}
