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
const sequelize_2 = require("sequelize");
const inventory_category_model_1 = require("./models/inventory-category.model");
const inventory_master_model_1 = require("./models/inventory-master.model");
const brand_model_1 = require("./models/brand.model");
const unit_model_1 = require("../boq/models/unit.model");
const brand_service_1 = require("./services/brand.service");
const unit_service_1 = require("./services//unit.service");
const inventory_request_service_1 = require("./services/inventory-request.service");
const inventory_dispatch_service_1 = require("./services/inventory-dispatch.service");
const project_material_service_1 = require("./services/project-material.service");
let InventoryService = class InventoryService {
    masterModel;
    brandService;
    unitService;
    requestService;
    dispatchService;
    projectMaterialService;
    constructor(masterModel, brandService, unitService, requestService, dispatchService, projectMaterialService) {
        this.masterModel = masterModel;
        this.brandService = brandService;
        this.unitService = unitService;
        this.requestService = requestService;
        this.dispatchService = dispatchService;
        this.projectMaterialService = projectMaterialService;
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
    async searchInventory(query) {
        return this.masterModel.findAll({
            where: {
                [sequelize_2.Op.or]: [
                    { item_name: { [sequelize_2.Op.like]: `%${query}%` } },
                    { item_code: { [sequelize_2.Op.like]: `%${query}%` } },
                ],
            },
            include: ['brand', 'unit', 'category'],
            limit: 25,
            order: [['item_name', 'ASC']],
        });
    }
    async getInventoryByCategory(categoryId) {
        return this.masterModel.findAll({
            where: { category_id: categoryId, is_active: true },
            include: ['brand', 'unit', 'category'],
        });
    }
    async getInventoryByBrand(brandId) {
        return this.masterModel.findAll({
            where: { brand_id: brandId, is_active: true },
            include: ['brand', 'unit', 'category'],
        });
    }
    async getInventoryDashboard() {
        const [totalItems, totalBrands, totalUnits, totalRequests, totalDispatches, totalProjectMaterials,] = await Promise.all([
            this.masterModel.count(),
            this.brandService.countTotal(),
            this.unitService.countTotal(),
            this.requestService.countTotal(),
            this.dispatchService.countTotal(),
            this.projectMaterialService.countTotal(),
        ]);
        return {
            totalItems,
            totalBrands,
            totalUnits,
            totalRequests,
            totalDispatches,
            totalProjectMaterials,
        };
    }
    async getProjectInventoryDashboard(projectId) {
        const [materials, requests, dispatches] = await Promise.all([
            this.projectMaterialService.countByProject(projectId),
            this.requestService.countByProject(projectId),
            this.dispatchService.countByProject(projectId),
        ]);
        return { projectId, materials, requests, dispatches };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __metadata("design:paramtypes", [Object, brand_service_1.BrandService,
        unit_service_1.UnitService,
        inventory_request_service_1.InventoryRequestService,
        inventory_dispatch_service_1.InventoryDispatchService,
        project_material_service_1.ProjectMaterialService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map