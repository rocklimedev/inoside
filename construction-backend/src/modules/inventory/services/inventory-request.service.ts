import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryRequest } from '../models/inventory-request.model';
import { CreateRequestDto } from '../dto/create-request.dto';

import { v4 as uuid } from 'uuid';

@Injectable()
export class InventoryRequestService {
  constructor(
    @InjectRepository(InventoryRequest)
    private repo: Repository<InventoryRequest>,
  ) {}

  async create(dto: CreateRequestDto, userId: string) {
    const request = this.repo.create({
      id: uuid(),
      ...dto,
      requested_by: userId,
      status: 'requested',
    });

    return this.repo.save(request);
  }

  async approve(id: string, approvedBy: string) {
    const request = await this.repo.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    request.status = 'approved';
    request.approved_by = approvedBy;

    return this.repo.save(request);
  }

  async getAll() {
    return this.repo.find({
      order: {
        created_at: 'DESC',
      },
    });
  }
}
