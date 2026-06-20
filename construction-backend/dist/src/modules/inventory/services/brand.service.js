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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const brand_model_1 = require("../models/brand.model");
const inventory_master_model_1 = require("../models/inventory-master.model");
let BrandService = class BrandService {
    brandModel;
    masterModel;
    constructor(brandModel, masterModel) {
        this.brandModel = brandModel;
        this.masterModel = masterModel;
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
    async countTotal() {
        return this.brandModel.count();
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
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(brand_model_1.Brand)),
    __param(1, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __metadata("design:paramtypes", [Object, Object])
], BrandService);
//# sourceMappingURL=brand.service.js.map