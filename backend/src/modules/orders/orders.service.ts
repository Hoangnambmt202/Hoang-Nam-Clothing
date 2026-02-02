import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '@modules/products/entities/product.entity';
// import { CartService } from '@modules/cart/cart.service';
import { ProductsService } from '@modules/products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderStatus } from '@common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    // private cartService: CartService,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, shippingAddress, notes } = createOrderDto;

    // Validate and calculate order
    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `${product.name} đã hết hàng hoặc không đủ số lượng`,
        );
      }

      const price = product.price;
      const itemTotal = Number(price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        size: item.size,
        color: item.color,
      });
    }

    // Create order
    const order = this.ordersRepository.create({
      userId,
      totalAmount,
      shippingAddress,
      notes,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    const orderItemEntities = orderItems.map((item) =>
      this.orderItemsRepository.create({
        ...item,
        orderId: savedOrder.id,
      }),
    );

    await this.orderItemsRepository.save(orderItemEntities);

    // Update product stock
    for (const item of items) {
      await this.productsService.updateStock(
        item.productId,
        item.quantity,
        'decrease',
      );
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(queryDto: OrderQueryDto): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const {
      status,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = queryDto;

    let query = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    // Apply filters
    if (status) {
      query = query.andWhere('order.status = :status', { status });
    }

    if (userId) {
      query = query.andWhere('order.userId = :userId', { userId });
    }

    if (startDate && endDate) {
      query = query.andWhere(
        'order.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    // Apply sorting and pagination
    query = query
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [orders, total] = await query.getManyAndCount();

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [orders, total] = await this.ordersRepository.findAndCount({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transitions
    if (updateOrderDto.status) {
      this.validateStatusTransition(order.status, updateOrderDto.status);
    }

    Object.assign(order, updateOrderDto);
    await this.ordersRepository.save(order);

    return this.findOne(id);
  }
  // src/modules/orders/orders.service.ts
  async updateStatus(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.status = newStatus;
    return this.ordersRepository.save(order);
  }

  async cancel(id: string, userId?: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user is authorized to cancel this order
    if (userId && order.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to cancel this order',
      );
    }

    // Check if order can be cancelled
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException(
        'Order cannot be cancelled in current status',
      );
    }

    // Restore product stock
    for (const item of order.items) {
      await this.productsService.updateStock(
        item.productId,
        item.quantity,
        'increase',
      );
    }

    order.status = OrderStatus.CANCELLED;
    await this.ordersRepository.save(order);

    return this.findOne(id);
  }

  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    const [
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
    ] = await Promise.all([
      this.ordersRepository.count(),
      this.ordersRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.ordersRepository.count({ where: { status: OrderStatus.CONFIRMED } }),
      this.ordersRepository.count({
        where: { status: OrderStatus.PROCESSING },
      }),
      this.ordersRepository.count({ where: { status: OrderStatus.SHIPPED } }),
      this.ordersRepository.count({ where: { status: OrderStatus.DELIVERED } }),
      this.ordersRepository.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    const revenueResult = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status != :status', { status: OrderStatus.CANCELLED })
      .getRawOne<{ total: string | null }>();

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue: revenueResult?.total ? parseFloat(revenueResult.total) : 0,
    };
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
