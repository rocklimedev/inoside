import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoqCategory } from '../models/boq-category.model';
import { Boq } from '../models/boq.model';
import { CreateBoqCategoryDto } from '../dto/create-boq-category.dto';

@Injectable()
export class BoqCategoryService {
  constructor(
    @InjectModel(BoqCategory)
    private boqCategoryModel: typeof BoqCategory,
  ) {}

  async findAll() {
    return this.boqCategoryModel.findAll({
      order: [['sort_order', 'ASC']],
      include: [{ model: Boq }],
    });
  }

  async create(data: CreateBoqCategoryDto) {
    return this.boqCategoryModel.create({
      name: data.name,
      code: data.code,
      description: data.description,
      sort_order: data.sort_order ?? 0,
      is_active: true,
    });
  }
}
