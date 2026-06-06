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
exports.BoqSubHeadingService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const boq_subheading_model_1 = require("../models/boq-subheading.model");
const boq_item_model_1 = require("../models/boq-item.model");
const unit_model_1 = require("../models/unit.model");
const inventory_master_model_1 = require("../../inventory/models/inventory-master.model");
const brand_model_1 = require("../../inventory/models/brand.model");
let BoqSubHeadingService = class BoqSubHeadingService {
    boqSubHeadingModel;
    constructor(boqSubHeadingModel) {
        this.boqSubHeadingModel = boqSubHeadingModel;
    }
    async create(data) {
        return this.boqSubHeadingModel.create({
            boq_id: data.boq_id,
            section_id: data.section_id,
            title: data.title,
            description: data.description,
            sort_order: data.sort_order ?? 0,
        });
    }
    async update(id, dto) {
        const subheading = await this.boqSubHeadingModel.findByPk(id);
        if (!subheading)
            throw new common_1.NotFoundException('Subheading not found');
        await subheading.update({
            title: dto.title ?? subheading.title,
            description: dto.description ?? subheading.description,
            sort_order: dto.sort_order ?? subheading.sort_order,
        });
        return subheading;
    }
    async delete(id) {
        const subheading = await this.boqSubHeadingModel.findByPk(id);
        if (!subheading)
            throw new common_1.NotFoundException('Subheading not found');
        await subheading.destroy();
        return { message: 'Subheading deleted successfully' };
    }
    async findBySection(sectionId) {
        return this.boqSubHeadingModel.findAll({
            where: { section_id: sectionId },
            include: [
                {
                    model: boq_item_model_1.BoqItem,
                    include: [unit_model_1.Unit, { model: inventory_master_model_1.InventoryMaster, include: [brand_model_1.Brand] }],
                },
            ],
            order: [['sort_order', 'ASC']],
        });
    }
};
exports.BoqSubHeadingService = BoqSubHeadingService;
exports.BoqSubHeadingService = BoqSubHeadingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(boq_subheading_model_1.BoqSubHeading)),
    __metadata("design:paramtypes", [Object])
], BoqSubHeadingService);
//# sourceMappingURL=boq-subheading.service.js.map