import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryDispatch } from '../models/inventory-dispatch.model';
import { InventoryRequest } from '../models/inventory-request.model';
import { DispatchMaterialDto } from '../dto/dispatch-material.dto';

import { v4 as uuid } from 'uuid';

@Injectable()
export class InventoryDispatchService {
  constructor(
    @InjectRepository(InventoryDispatch)
    private dispatchRepo: Repository<InventoryDispatch>,

    @InjectRepository(InventoryRequest)
    private requestRepo: Repository<InventoryRequest>,
  ) {}

  async dispatch(dto: DispatchMaterialDto) {
    const request = await this.requestRepo.findOne({
      where: { id: dto.request_id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const dispatch = this.dispatchRepo.create({
      id: uuid(),
      ...dto,
      dispatch_date: new Date(),
    });

    request.status = 'dispatched';

    await this.requestRepo.save(request);

    return this.dispatchRepo.save(dispatch);
  }

  async markDelivered(dispatchId: string, received_quantity: number) {
    const dispatch = await this.dispatchRepo.findOne({
      where: { id: dispatchId },
    });

    if (!dispatch) {
      throw new NotFoundException('Dispatch not found');
    }

    dispatch.received_quantity = received_quantity;
    dispatch.supervisor_confirmation = true;

    return this.dispatchRepo.save(dispatch);
  }
}
