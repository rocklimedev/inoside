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
const inventory_category_model_1 = require("./models/inventory-category.model");
const inventory_request_model_1 = require("./models/inventory-request.model");
const inventory_dispatch_model_1 = require("./models/inventory-dispatch.model");
const inventory_master_model_1 = require("./models/inventory-master.model");
const project_materials_model_1 = require("./models/project-materials.model");
const brand_model_1 = require("./models/brand.model");
const unit_model_1 = require("../boq/models/unit.model");
let InventoryService = class InventoryService {
    requestModel;
    dispatchModel;
    masterModel;
    projectMaterialModel;
    brandModel;
    unitModel;
    constructor(requestModel, dispatchModel, masterModel, projectMaterialModel, brandModel, unitModel) {
        this.requestModel = requestModel;
        this.dispatchModel = dispatchModel;
        this.masterModel = masterModel;
        this.projectMaterialModel = projectMaterialModel;
        this.brandModel = brandModel;
        this.unitModel = unitModel;
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
        return this.requestModel.create({
            id: (0, uuid_1.v4)(),
            ...dto,
        });
    }
    async findAllRequests() {
        return this.requestModel.findAll({
            include: [
                { all: true, nested: true },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async findRequestById(id) {
        const request = await this.requestModel.findByPk(id, {
            include: { all: true, nested: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Inventory request not found');
        return request;
    }
    async updateRequest(id, dto) {
        const request = await this.findRequestById(id);
        return request.update(dto);
    }
    async deleteRequest(id) {
        const request = await this.findRequestById(id);
        await request.destroy();
        return { message: 'Request deleted successfully' };
    }
    async createDispatch(dto) {
        return this.dispatchModel.create({
            id: (0, uuid_1.v4)(),
            ...dto,
        });
    }
    async findAllDispatches() {
        return this.dispatchModel.findAll({
            include: [{ all: true, nested: true }],
            order: [['created_at', 'DESC']],
        });
    }
    async findDispatchById(id) {
        const dispatch = await this.dispatchModel.findByPk(id, {
            include: [{ all: true, nested: true }],
        });
        if (!dispatch)
            throw new common_1.NotFoundException('Dispatch record not found');
        return dispatch;
    }
    async updateDispatch(id, dto) {
        const dispatch = await this.findDispatchById(id);
        return dispatch.update(dto);
    }
    async deleteDispatch(id) {
        const dispatch = await this.findDispatchById(id);
        await dispatch.destroy();
        return { message: 'Dispatch deleted successfully' };
    }
    async createMaster(dto) {
        return this.masterModel.create({
            id: (0, uuid_1.v4)(),
            ...dto,
        });
    }
    async findAllMaster() {
        return this.masterModel.findAll({
            include: [
                { model: brand_model_1.Brand, as: 'brand' },
                { model: unit_model_1.Unit, as: 'unit' },
                { model: inventory_category_model_1.InventoryCategory, as: 'category' },
            ],
            order: [['item_name', 'ASC']],
        });
    }
    async findMasterById(id) {
        const item = await this.masterModel.findByPk(id, {
            include: ['brand', 'unit', 'category'],
        });
        if (!item)
            throw new common_1.NotFoundException('Inventory item not found');
        return item;
    }
    async updateMaster(id, dto) {
        const item = await this.findMasterById(id);
        return item.update(dto);
    }
    async deleteMaster(id) {
        const item = await this.findMasterById(id);
        await item.destroy();
        return { message: 'Inventory item deleted successfully' };
    }
    async findAllProjectMaterials() {
        return this.projectMaterialModel.findAll({
            include: ['project', 'inventoryMaster', 'unit', 'brand'],
        });
    }
    async findAllBrands() {
        return this.brandModel.findAll({
            where: { is_active: true },
            order: [['name', 'ASC']],
        });
    }
    async createBrand(name) {
        const trimmedName = name.trim();
        const existing = await this.brandModel.findOne({
            where: { name: trimmedName },
        });
        if (existing) {
            throw new common_1.ConflictException('Brand with this name already exists');
        }
        return this.brandModel.create({
            id: (0, uuid_1.v4)(),
            name: trimmedName,
            is_active: true,
        });
    }
    async deleteBrand(id) {
        const brand = await this.brandModel.findByPk(id);
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        const used = await this.masterModel.count({ where: { brand_id: id } });
        if (used > 0) {
            throw new common_1.BadRequestException('Cannot delete brand: It is in use');
        }
        await brand.destroy();
        return { message: 'Brand deleted successfully' };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(inventory_request_model_1.InventoryRequest)),
    __param(1, (0, sequelize_1.InjectModel)(inventory_dispatch_model_1.InventoryDispatch)),
    __param(2, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __param(3, (0, sequelize_1.InjectModel)(project_materials_model_1.ProjectMaterial)),
    __param(4, (0, sequelize_1.InjectModel)(brand_model_1.Brand)),
    __param(5, (0, sequelize_1.InjectModel)(unit_model_1.Unit)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map