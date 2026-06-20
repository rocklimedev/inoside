"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoqItemService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const boq_item_model_1 = require("../models/boq-item.model");
const unit_model_1 = require("../models/unit.model");
const inventory_master_model_1 = require("../../inventory/models/inventory-master.model");
const brand_model_1 = require("../../inventory/models/brand.model");
let BoqItemService = class BoqItemService {
    boqItemModel;
    unitModel;
    inventoryMasterModel;
    constructor(boqItemModel, unitModel, inventoryMasterModel) {
        this.boqItemModel = boqItemModel;
        this.unitModel = unitModel;
        this.inventoryMasterModel = inventoryMasterModel;
    }
    async resolveUnitId(unitInput) {
        if (!unitInput?.trim())
            return null;
        const trimmed = unitInput.trim();
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
        if (uuidRegex.test(trimmed))
            return trimmed;
        const unit = await this.unitModel.findOne({
            where: { short_name: trimmed.toLowerCase() },
        });
        if (unit)
            return unit.id;
        console.warn(`⚠️ Unit with short_name "${trimmed}" not found.`);
        return null;
    }
    async resolveInventoryMasterId(dto, finalUnitId) {
        if (!dto.inventory_master_id) {
            let master = await this.inventoryMasterModel.findOne({
                where: { item_name: dto.item_name.trim() },
            });
            if (!master) {
                master = await this.inventoryMasterModel.create({
                    id: (0, uuid_1.v4)(),
                    item_name: dto.item_name.trim(),
                    item_code: dto.item_code || `AUTO-${Date.now()}`,
                    description: dto.description || null,
                    specification: dto.specification || null,
                    brand_id: null,
                    unit_id: finalUnitId,
                    default_rate: dto.rate || 0,
                    is_active: true,
                });
            }
            return master.id;
        }
        const existingMaster = await this.inventoryMasterModel.findByPk(dto.inventory_master_id);
        if (!existingMaster)
            throw new common_1.NotFoundException('Inventory master item not found');
        return existingMaster.id;
    }
    async createItem(dto, subheadingExists) {
        if (dto.subheading_id && !subheadingExists) {
            throw new common_1.NotFoundException('Subheading not found');
        }
        const finalUnitId = await this.resolveUnitId(dto.unit_id);
        const inventoryMasterId = await this.resolveInventoryMasterId(dto, finalUnitId);
        const item = await this.boqItemModel.create({
            boq_id: dto.boq_id,
            section_id: dto.section_id,
            subheading_id: dto.subheading_id || null,
            inventory_master_id: inventoryMasterId,
            item_name: dto.item_name.trim(),
            specification: dto.specification || null,
            unit_id: finalUnitId,
            qty: dto.qty ?? 0,
            rate: dto.rate ?? 0,
            tax_percent: 0,
            discount_percent: 0,
            wastage_percent: dto.wastage_percent ?? 0,
            remarks: dto.remarks || null,
            sort_order: dto.sort_order ?? 0,
        });
        const createdItem = await this.boqItemModel.findByPk(item.id, {
            include: [unit_model_1.Unit, { model: inventory_master_model_1.InventoryMaster, include: [brand_model_1.Brand] }],
        });
        if (!createdItem) {
            throw new common_1.NotFoundException('Created item could not be loaded');
        }
        return createdItem;
    }
    async updateItem(id, updateData) {
        const item = await this.boqItemModel.findByPk(id);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const dataToUpdate = { ...updateData };
        dataToUpdate.tax_percent = 0;
        if (updateData.unit_id !== undefined) {
            const resolvedUnitId = await this.resolveUnitId(updateData.unit_id);
            dataToUpdate.unit_id = resolvedUnitId ?? undefined;
        }
        if (dataToUpdate.discount_percent === null)
            dataToUpdate.discount_percent = 0;
        if (dataToUpdate.wastage_percent === null)
            dataToUpdate.wastage_percent = 0;
        await item.update(dataToUpdate);
        return {
            updatedItem: await this.boqItemModel.findByPk(id, {
                include: [unit_model_1.Unit, { model: inventory_master_model_1.InventoryMaster, include: [brand_model_1.Brand] }],
            }),
            boqId: item.boq_id,
        };
    }
    async deleteItem(id) {
        const item = await this.boqItemModel.findByPk(id);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const boqId = item.boq_id;
        await item.destroy();
        return { boqId };
    }
    async findAllByBoq(boqId) {
        return this.boqItemModel.findAll({ where: { boq_id: boqId } });
    }
    async destroyAllByBoq(boqId) {
        return this.boqItemModel.destroy({ where: { boq_id: boqId } });
    }
};
exports.BoqItemService = BoqItemService;
exports.BoqItemService = BoqItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(boq_item_model_1.BoqItem)),
    __param(1, (0, sequelize_1.InjectModel)(unit_model_1.Unit)),
    __param(2, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __metadata("design:paramtypes", [Object, Object, Object])
], BoqItemService);
//# sourceMappingURL=boq-item.service.js.map