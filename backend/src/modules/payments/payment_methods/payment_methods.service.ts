import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment_methods.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(createDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const method = this.paymentMethodRepository.create(createDto);
    return this.paymentMethodRepository.save(method);
  }

  async findAll(activeOnly = false): Promise<PaymentMethod[]> {
    const query = this.paymentMethodRepository.createQueryBuilder('payment_method');
    if (activeOnly) {
      query.where('payment_method.isActive = :isActive', { isActive: true });
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<PaymentMethod> {
    const method = await this.paymentMethodRepository.findOne({ where: { id } });
    if (!method) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    return method;
  }

  async update(id: string, updateDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const method = await this.findOne(id);
    Object.assign(method, updateDto);
    return this.paymentMethodRepository.save(method);
  }

  async remove(id: string): Promise<void> {
    const method = await this.findOne(id);
    await this.paymentMethodRepository.remove(method);
  }
}
