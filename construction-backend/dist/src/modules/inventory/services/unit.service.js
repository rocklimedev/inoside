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
exports.UnitService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const unit_model_1 = require("../../boq/models/unit.model");
const inventory_master_model_1 = require("../models/inventory-master.model");
let UnitService = class UnitService {
    unitModel;
    masterModel;
    constructor(unitModel, masterModel) {
        this.unitModel = unitModel;
        this.masterModel = masterModel;
    }
    async createUnit(name, shortName) {
        const existing = await this.unitModel.findOne({
            where: { short_name: shortName.toLowerCase().trim() },
        });
        if (existing) {
            throw new common_1.ConflictException(`Unit with short name "${shortName}" already exists`);
        }
        return this.unitModel.create({
            id: (0, uuid_1.v4)(),
            name: name.trim(),
            short_name: shortName.toLowerCase().trim(),
        });
    }
    async findAllUnits() {
        return this.unitModel.findAll({ order: [['name', 'ASC']] });
    }
    async findUnitById(id) {
        const unit = await this.unitModel.findByPk(id);
        if (!unit)
            throw new common_1.NotFoundException('Unit not found');
        return unit;
    }
    async findUnitByShortName(shortName) {
        const unit = await this.unitModel.findOne({
            where: { short_name: shortName.toLowerCase().trim() },
        });
        if (!unit)
            throw new common_1.NotFoundException(`Unit with short name "${shortName}" not found`);
        return unit;
    }
    async updateUnit(id, name, shortName) {
        const unit = await this.findUnitById(id);
        if (shortName) {
            const existing = await this.unitModel.findOne({
                where: { short_name: shortName.toLowerCase().trim() },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Short name "${shortName}" is already in use`);
            }
        }
        return unit.update({
            ...(name && { name: name.trim() }),
            ...(shortName && { short_name: shortName.toLowerCase().trim() }),
        });
    }
    async countTotal() {
        return this.unitModel.count();
    }
    async deleteUnit(id) {
        const unit = await this.findUnitById(id);
        const usedInMaster = await this.masterModel.count({
            where: { unit_id: id },
        });
        if (usedInMaster > 0) {
            throw new common_1.BadRequestException('Cannot delete unit: It is referenced by inventory items');
        }
        await unit.destroy();
        return { message: 'Unit deleted successfully' };
    }
};
exports.UnitService = UnitService;
exports.UnitService = UnitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(unit_model_1.Unit)),
    __param(1, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __metadata("design:paramtypes", [Object, Object])
], UnitService);
//# sourceMappingURL=unit.service.js.map