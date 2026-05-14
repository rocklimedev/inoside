import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMaster } from '../models/inventory-master.model';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';

import { v4 as uuid } from 'uuid';

@Injectable()
export class InventoryMasterService {
  constructor(
    @InjectRepository(InventoryMaster)
    private repo: Repository<InventoryMaster>,
  ) {}

  async create(dto: CreateInventoryItemDto) {
    const item = this.repo.create({
      id: uuid(),
      ...dto,
    });

    return this.repo.save(item);
  }

  async findAll() {
    return this.repo.find({
      order: {
        item_name: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }
}
