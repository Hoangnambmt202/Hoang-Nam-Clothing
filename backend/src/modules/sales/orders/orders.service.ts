import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';
import { ProductsService } from '@/modules/catalog/products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderStatus } from '@common/enums/order-status.enum';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';
import { ShippingMethod } from '@/modules/shipping/shipping_methods/entities/shipping_methods.entity';
import { UsersService } from '@/modules/users/user.service';
import { CartService } from '@/modules/sales/cart/cart.service';
import { PaymentTransaction, PaymentStatus } from '@/modules/payments/payment_transactions/entities/payment_transaction.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
    private productsService: ProductsService,
    @InjectRepository(ShippingMethod)
    private readonly shippingMethodRepository: Repository<ShippingMethod>,
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
    private readonly usersService: UsersService,
    private readonly cartService: CartService,
  ) {}

  async checkout(userId: string | undefined, checkoutDto: CheckoutDto): Promise<Order> {
    const { items, notes, shippingMethodId, shippingAddress, guestInfo, paymentMethod } = checkoutDto;

    let finalUserId = userId;

    // 1. Handle Guest User Creation
    if (!finalUserId) {
      if (!guestInfo) {
        throw new BadRequestException('Guest info is required if not logged in');
      }
      
      // Try to find user by phone, or create new user
      // Note: Assuming usersService has a method to find by phone, if not we search by email or just create.
      // We will create a default user.
      const defaultEmail = guestInfo.email || `guest_${guestInfo.phone}@hoangnam.local`;
      let user: any = await this.usersService.findByEmail(defaultEmail).catch(() => null);
      
      if (!user) {
        user = await this.usersService.create({
          email: defaultEmail,
          password: uuidv4(), // random password
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          phone: guestInfo.phone,
          // role will default to CUSTOMER
        });
      }
      if (!user) throw new BadRequestException('Failed to create guest user');
      
      finalUserId = user.id;
    }

    let subTotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    // 2. Validate Shipping Method
    let shippingMethod = await this.shippingMethodRepository.findOne({
      where: { id: shippingMethodId, isActive: true },
    });
    if (!shippingMethod) {
      shippingMethod = await this.shippingMethodRepository.findOne({
        where: { isActive: true },
      });
    }
    if (!shippingMethod) {
      throw new NotFoundException('Shipping method not found or inactive');
    }

    // 3. Process items and check stock
    const variantMap = new Map<string, { variantId: string; quantity: number }>();
    for (const item of items) {
      const variant = await this.variantRepository.findOne({
        where: { id: item.productId },
        relations: ['product'],
      });

      if (!variant) {
        throw new NotFoundException(`Variant ${item.productId} not found`);
      }

      if (variant.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm ${variant.product.name} (Size: ${variant.size}, Màu: ${variant.color}) không đủ số lượng`,
        );
      }

      const price = Number(variant.price);
      subTotal += price * item.quantity;

      // Track variant for stock reduction
      variantMap.set(variant.id, { variantId: variant.id, quantity: item.quantity });

      orderItems.push(
        this.orderItemsRepository.create({
          productId: variant.product.id,
          productVariantId: variant.id,
          quantity: item.quantity,
          price,
        })
      );
    }

    const shippingFee = Number(shippingMethod.baseCost);
    const discountAmount = 0; // Tích hợp coupon sau
    const finalAmount = subTotal + shippingFee - discountAmount;

    // 4. Create Order
    const order = this.ordersRepository.create({
      userId: finalUserId,
      totalAmount: subTotal, // backward compatibility
      finalAmount,
      subTotal,
      shippingFee,
      discountAmount,
      notes,
      status: OrderStatus.PENDING,
      shippingMethod,
      shippingAddress,
      paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // 5. Save Order Items & Reduce Variant Stock
    const orderItemEntities = orderItems.map((item) =>
      this.orderItemsRepository.create({
        ...item,
        orderId: savedOrder.id,
      }),
    );
    await this.orderItemsRepository.save(orderItemEntities);

    // Reduce stock for each variant
    for (const [variantId, { quantity }] of variantMap) {
      await this.variantRepository.decrement({ id: variantId }, 'stockQuantity', quantity);
    }

    // 6. Create Payment Transaction
    const tx = this.paymentTransactionRepository.create({
      order: savedOrder,
      transactionId: uuidv4(),
      paymentMethod,
      amount: finalAmount,
      status: PaymentStatus.PENDING,
    });
    await this.paymentTransactionRepository.save(tx);

    // 7. Clear Cart if logged in
    if (userId) {
      await this.cartService.clearCart(userId).catch(e => console.error(e));
    }

    return this.findOne(savedOrder.id);
  }

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, notes, shippingMethodId } = createOrderDto;

    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    // 1. Validate Shipping Method
    let shippingMethod = await this.shippingMethodRepository.findOne({
      where: { id: shippingMethodId, isActive: true },
    });
    if (!shippingMethod) {
      shippingMethod = await this.shippingMethodRepository.findOne({
        where: { isActive: true },
      });
    }
    if (!shippingMethod) {
      throw new NotFoundException('Shipping method not found or inactive');
    }
    // 1. Duyệt qua các item để tính tiền và check tồn kho Variant
    for (const item of items) {
      // Giả sử DTO gửi lên là productId nhưng thực chất là VariantId
      const variant = await this.variantRepository.findOne({
        where: { id: item.productId },
        relations: ['product'], // Load product cha để lấy tên
      });

      if (!variant) {
        throw new NotFoundException(`Variant ${item.productId} not found`);
      }

      // Check tồn kho của Variant (dùng stockQuantity camelCase)
      if (variant.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm ${variant.product.name} (Size: ${variant.size}, Màu: ${variant.color}) không đủ số lượng`,
        );
      }

      // Lấy giá từ Variant (hoặc logic giá riêng)
      // Lưu ý: convert sang Number để tránh lỗi cộng chuỗi
      const price = Number(variant.price);
      // Hoặc nếu bạn đã lưu giá bán cuối cùng vào variant thì: const price = Number(variant.price);

      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      const order = this.orderItemsRepository.create({
        productId: variant.product.id,
        productVariantId: variant.id,
        quantity: item.quantity,
        price,
      });
      orderItems.push(order);
    }

    // 2. Tính Final Amount
    // Logic: Final = Total + Ship - Discount. Tạm thời cho bằng Total.
    const shippingCost = Number(shippingMethod.baseCost);

    // Giả sử finalAmount = Tiền hàng + Phí ship (chưa tính voucher)
    const finalAmount = totalAmount + shippingCost;

    // 3. Tạo Order
    const order = this.ordersRepository.create({
      userId,
      totalAmount,
      finalAmount, // Đã tính phí ship
      notes,
      status: OrderStatus.PENDING,
      shippingMethod: shippingMethod, // Gán quan hệ
      // shippingMethodId: shippingMethod.id // Hoặc gán ID nếu entity có cột này
    });

    const savedOrder = await this.ordersRepository.save(order);

    // 4. Lưu Order Items
    const orderItemEntities = orderItems.map((item) =>
      this.orderItemsRepository.create({
        ...item,
        orderId: savedOrder.id,
      }),
    );
    await this.orderItemsRepository.save(orderItemEntities);
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
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('items.productVariant', 'productVariant');

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
      relations: ['user', 'items', 'items.product', 'items.productVariant'],
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
      relations: ['items', 'items.product', 'items.productVariant'],
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
