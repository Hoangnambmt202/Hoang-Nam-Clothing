import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingMethod } from './entities/shipping_methods.entity';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';

@Injectable()
export class ShippingMethodsService {
  constructor(
    @InjectRepository(ShippingMethod)
    private readonly shippingMethodRepository: Repository<ShippingMethod>,
  ) {}

  async create(createDto: CreateShippingMethodDto): Promise<ShippingMethod> {
    const method = this.shippingMethodRepository.create(createDto);
    return this.shippingMethodRepository.save(method);
  }

  async findAll(activeOnly = false): Promise<ShippingMethod[]> {
    const query = this.shippingMethodRepository.createQueryBuilder('shipping_method');
    if (activeOnly) {
      query.where('shipping_method.isActive = :isActive', { isActive: true });
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<ShippingMethod> {
    const method = await this.shippingMethodRepository.findOne({ where: { id } });
    if (!method) {
      throw new NotFoundException(`Shipping method with ID ${id} not found`);
    }
    return method;
  }

  async update(id: string, updateDto: UpdateShippingMethodDto): Promise<ShippingMethod> {
    const method = await this.findOne(id);
    Object.assign(method, updateDto);
    return this.shippingMethodRepository.save(method);
  }

  async remove(id: string): Promise<void> {
    const method = await this.findOne(id);
    await this.shippingMethodRepository.remove(method);
  }
}
