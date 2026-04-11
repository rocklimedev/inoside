import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoqVersion } from './entities/boq-version.entity';
import { BoqItem } from './entities/boq-item.entity';
import { CreateBoqVersionDto } from './dto/create-boq-version.dto';

@Injectable()
export class BoqService {
  constructor(
    @InjectRepository(BoqVersion)
    private readonly boqRepo: Repository<BoqVersion>,
    @InjectRepository(BoqItem)
    private readonly itemRepo: Repository<BoqItem>,
  ) {}

  async create(
    project_id: string,
    dto: CreateBoqVersionDto,
    preparedBy: string,
  ) {
    // Create BOQ Version
    const boq = this.boqRepo.create({
      project_id,
      prepared_by: preparedBy,
      prepared_date: dto.prepared_date
        ? new Date(dto.prepared_date)
        : new Date(),
      version: dto.version || 1,
      notes: dto.notes,
    });

    const savedBoq = await this.boqRepo.save(boq);

    // Create BOQ Items
    if (dto.items?.length > 0) {
      const items = dto.items.map((item) =>
        this.itemRepo.create({
          boq_id: savedBoq.id,
          category: item.category,
          item_name: item.item_name,
          quantity: item.quantity.toString(),
          unit: item.unit,
          rate: item.rate != null ? item.rate.toString() : null,
          specifications: item.specifications,
          remarks: item.remarks,
        }),
      );

      await this.itemRepo.save(items);
    }

    // Refresh to get generated fields (amount + updated grand_total if you add trigger)
    return this.findOne(savedBoq.id);
  }

  async findByProject(project_id: string) {
    return this.boqRepo.find({
      where: { project_id },
      relations: ['items', 'preparer'],
      order: { version: 'DESC' },
    });
  }

  async findOne(id: string) {
    const boq = await this.boqRepo.findOne({
      where: { id },
      relations: ['items', 'preparer'],
    });

    if (!boq) throw new NotFoundException('BOQ version not found');

    // Optional: Calculate grand_total on the fly if not stored
    if (boq.items?.length) {
      boq.grand_total = boq.items
        .reduce((sum, item) => {
          const amount = parseFloat(item.amount?.toString() || '0');
          return sum + amount;
        }, 0)
        .toFixed(2);
    }

    return boq;
  }

  async getLatest(project_id: string) {
    const boq = await this.boqRepo.findOne({
      where: { project_id },
      relations: ['items', 'preparer'],
      order: { version: 'DESC' },
    });

    if (!boq) return null;

    // Calculate grand total from items
    if (boq.items?.length) {
      boq.grand_total = boq.items
        .reduce(
          (sum, item) => sum + parseFloat(item.amount?.toString() || '0'),
          0,
        )
        .toFixed(2);
    }

    return boq;
  }
}
