/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { Order } from './entities/order.entity';
import { OrderStatus } from '@/common/enums/order-status.enum';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(@Query() queryDto: OrderQueryDto) {
    return this.ordersService.findAll(queryDto);
  }

  @Get('my-orders')
  async findMyOrders(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.ordersService.findUserOrders(req.user.id, page, limit);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    return order;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Post(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  confirmOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.CONFIRMED);
  }

  @Post(':id/process')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  processOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.PROCESSING);
  }

  @Post(':id/ship')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  shipOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.SHIPPED);
  }

  @Post(':id/deliver')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deliverOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.DELIVERED);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Request() req, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.ordersService.cancel(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async adminCancelOrder(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findUserOrdersAdmin(
    @Param('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findUserOrders(userId, page, limit);
  }

  @Get('status/:status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findOrdersByStatus(
    @Param('status') status: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const queryDto = new OrderQueryDto();
    queryDto.status = status as OrderStatus; // ✅ ép về enum
    queryDto.page = page;
    queryDto.limit = limit;

    return this.ordersService.findAll(queryDto);
  }
}
