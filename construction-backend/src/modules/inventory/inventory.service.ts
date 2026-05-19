import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { InventoryRequest } from './models/inventory-request.model';
import { InventoryDispatch } from './models/inventory-dispatch.model';
import { InventoryMaster } from './models/inventory-master.model';
import { Material } from './models/materials.model';
import { Brand } from './models/brand.model';

import { CreateInventoryRequestDto } from './dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from './dto/update-inventory-request.dto';
import { CreateInventoryDispatchDto } from './dto/create-inventory-dispatch.dto';
import { UpdateInventoryDispatchDto } from './dto/update-inventory-dispatch.dto';
import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';

import { v4 as uuid } from 'uuid';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryRequest)
    private requestModel: typeof InventoryRequest,

    @InjectModel(InventoryDispatch)
    private dispatchModel: typeof InventoryDispatch,

    @InjectModel(InventoryMaster)
    private masterModel: typeof InventoryMaster,

    @InjectModel(Material)
    private materialModel: typeof Material,

    @InjectModel(Brand)
    private brandModel: typeof Brand,
  ) {}

  // ---------------- INVENTORY REQUEST ----------------

  async createRequest(dto: CreateInventoryRequestDto) {
    return this.requestModel.create({
      id: uuid(),
      ...dto,
    } as any);
  }

  async findAllRequests() {
    return this.requestModel.findAll({
      include: { all: true },
    });
  }

  async findRequestById(id: string) {
    const data = await this.requestModel.findByPk(id, {
      include: { all: true },
    });

    if (!data) throw new NotFoundException('Request not found');
    return data;
  }

  async updateRequest(id: string, dto: UpdateInventoryRequestDto) {
    const req = await this.findRequestById(id);
    return req.update(dto);
  }

  async deleteRequest(id: string) {
    const req = await this.findRequestById(id);
    return req.destroy();
  }

  // ---------------- INVENTORY DISPATCH ----------------

  async createDispatch(dto: CreateInventoryDispatchDto) {
    return this.dispatchModel.create({
      id: uuid(),
      ...dto,
    } as any);
  }

  async findAllDispatches() {
    return this.dispatchModel.findAll({
      include: { all: true },
    });
  }

  async updateDispatch(id: string, dto: UpdateInventoryDispatchDto) {
    const dispatch = await this.dispatchModel.findByPk(id);

    if (!dispatch) throw new NotFoundException('Dispatch not found');

    return dispatch.update(dto);
  }

  // ---------------- INVENTORY MASTER ----------------

  async createMaster(dto: CreateInventoryMasterDto) {
    return this.masterModel.create({
      id: uuid(),
      ...dto,
    } as any);
  }

  async findAllMaster() {
    return this.masterModel.findAll({
      include: [
        { association: 'brand' }, // ✅ NEW BRAND RELATION
        { association: 'unit' },
      ],
    });
  }

  async updateMaster(id: string, dto: UpdateInventoryMasterDto) {
    const item = await this.masterModel.findByPk(id);

    if (!item) throw new NotFoundException('Item not found');

    return item.update(dto);
  }

  async deleteMaster(id: string) {
    const item = await this.masterModel.findByPk(id);

    if (!item) throw new NotFoundException('Item not found');

    return item.destroy();
  }

  // ---------------- MATERIAL ----------------

  async findAllMaterials() {
    return this.materialModel.findAll();
  }

  // ---------------- BRAND ----------------

  async findAllBrands() {
    return this.brandModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async createBrand(name: string) {
    return this.brandModel.create({
      id: uuid(),
      name,
      is_active: true,
    } as any);
  }

  async deleteBrand(id: string) {
    const brand = await this.brandModel.findByPk(id);

    if (!brand) throw new NotFoundException('Brand not found');

    return brand.destroy();
  }
}
