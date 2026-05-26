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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const inventory_request_model_1 = require("./models/inventory-request.model");
const inventory_dispatch_model_1 = require("./models/inventory-dispatch.model");
const inventory_master_model_1 = require("./models/inventory-master.model");
const materials_model_1 = require("./models/materials.model");
const brand_model_1 = require("./models/brand.model");
const unit_model_1 = require("../boq/models/unit.model");
let InventoryService = class InventoryService {
    requestModel;
    dispatchModel;
    masterModel;
    materialModel;
    brandModel;
    unitModel;
    constructor(requestModel, dispatchModel, masterModel, materialModel, brandModel, unitModel) {
        this.requestModel = requestModel;
        this.dispatchModel = dispatchModel;
        this.masterModel = masterModel;
        this.materialModel = materialModel;
        this.brandModel = brandModel;
        this.unitModel = unitModel;
    }
    async createUnit(name, shortName) {
        const existing = await this.unitModel.findOne({
            where: { short_name: shortName.toLowerCase().trim() },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Unit with short name "${shortName}" already exists`);
        }
        return this.unitModel.create({
            id: (0, uuid_1.v4)(),
            name: name.trim(),
            short_name: shortName.toLowerCase().trim(),
        });
    }
    async findAllUnits() {
        return this.unitModel.findAll({
            order: [['name', 'ASC']],
        });
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
                throw new common_1.BadRequestException(`Short name "${shortName}" is already in use`);
            }
        }
        return unit.update({
            ...(name && { name: name.trim() }),
            ...(shortName && { short_name: shortName.toLowerCase().trim() }),
        });
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
    async createRequest(dto) {
        return this.requestModel.create({ id: (0, uuid_1.v4)(), ...dto });
    }
    async findAllRequests() {
        return this.requestModel.findAll({ include: { all: true } });
    }
    async findRequestById(id) {
        const data = await this.requestModel.findByPk(id, {
            include: { all: true },
        });
        if (!data)
            throw new common_1.NotFoundException('Request not found');
        return data;
    }
    async updateRequest(id, dto) {
        const req = await this.findRequestById(id);
        return req.update(dto);
    }
    async deleteRequest(id) {
        const req = await this.findRequestById(id);
        return req.destroy();
    }
    async createDispatch(dto) {
        return this.dispatchModel.create({ id: (0, uuid_1.v4)(), ...dto });
    }
    async findAllDispatches() {
        return this.dispatchModel.findAll({ include: { all: true } });
    }
    async updateDispatch(id, dto) {
        const dispatch = await this.dispatchModel.findByPk(id);
        if (!dispatch)
            throw new common_1.NotFoundException('Dispatch not found');
        return dispatch.update(dto);
    }
    async createMaster(dto) {
        return this.masterModel.create({ id: (0, uuid_1.v4)(), ...dto });
    }
    async findAllMaster() {
        return this.masterModel.findAll({
            include: [{ association: 'brand' }, { association: 'unit' }],
        });
    }
    async updateMaster(id, dto) {
        const item = await this.masterModel.findByPk(id);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        return item.update(dto);
    }
    async deleteMaster(id) {
        const item = await this.masterModel.findByPk(id);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        return item.destroy();
    }
    async findAllMaterials() {
        return this.materialModel.findAll();
    }
    async findAllBrands() {
        return this.brandModel.findAll({ order: [['name', 'ASC']] });
    }
    async createBrand(name) {
        return this.brandModel.create({ id: (0, uuid_1.v4)(), name, is_active: true });
    }
    async deleteBrand(id) {
        const brand = await this.brandModel.findByPk(id);
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        return brand.destroy();
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(inventory_request_model_1.InventoryRequest)),
    __param(1, (0, sequelize_1.InjectModel)(inventory_dispatch_model_1.InventoryDispatch)),
    __param(2, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __param(3, (0, sequelize_1.InjectModel)(materials_model_1.Material)),
    __param(4, (0, sequelize_1.InjectModel)(brand_model_1.Brand)),
    __param(5, (0, sequelize_1.InjectModel)(unit_model_1.Unit)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map