import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findAll(userId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id, userId },
    });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async create(userId: string, createAddressDto: any): Promise<Address> {
    // If it's the first address, make it default
    const count = await this.addressRepository.count({ where: { userId } });
    if (count === 0) {
      createAddressDto.isDefault = true;
    }

    if (createAddressDto.isDefault) {
      await this.resetDefault(userId);
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    } as DeepPartial<Address>);
    return this.addressRepository.save(address);
  }

  async update(id: string, userId: string, updateAddressDto: any): Promise<Address> {
    const address = await this.findOne(id, userId);

    if (updateAddressDto.isDefault) {
      await this.resetDefault(userId);
    }

    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: string, userId: string): Promise<void> {
    const address = await this.findOne(id, userId);
    await this.addressRepository.remove(address);
    
    // If we removed the default address, make the most recent one default
    if (address.isDefault) {
      const nextDefault = await this.addressRepository.findOne({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      if (nextDefault) {
        nextDefault.isDefault = true;
        await this.addressRepository.save(nextDefault);
      }
    }
  }

  private async resetDefault(userId: string) {
    await this.addressRepository.update(
      { userId, isDefault: true },
      { isDefault: false },
    );
  }
}
