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
exports.BoqSectionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const boq_section_model_1 = require("../models/boq-section.model");
const boq_subheading_model_1 = require("../models/boq-subheading.model");
const boq_item_model_1 = require("../models/boq-item.model");
const unit_model_1 = require("../models/unit.model");
const inventory_master_model_1 = require("../../inventory/models/inventory-master.model");
const brand_model_1 = require("../../inventory/models/brand.model");
let BoqSectionService = class BoqSectionService {
    boqSectionModel;
    constructor(boqSectionModel) {
        this.boqSectionModel = boqSectionModel;
    }
    async createSection(dto) {
        return this.boqSectionModel.create(dto);
    }
    async updateSection(id, dto) {
        const section = await this.boqSectionModel.findByPk(id);
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        await section.update({
            title: dto.title ?? section.title,
            description: dto.description ?? section.description,
            sort_order: dto.sort_order ?? section.sort_order,
        });
        return section;
    }
    async deleteSection(id) {
        const section = await this.boqSectionModel.findByPk(id);
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        await section.destroy();
        return { message: 'Section deleted successfully' };
    }
    async findSectionsByBoq(boqId) {
        return this.boqSectionModel.findAll({
            where: { boq_id: boqId },
            include: [
                {
                    model: boq_subheading_model_1.BoqSubHeading,
                    include: [
                        {
                            model: boq_item_model_1.BoqItem,
                            include: [unit_model_1.Unit, { model: inventory_master_model_1.InventoryMaster, include: [brand_model_1.Brand] }],
                        },
                    ],
                },
            ],
            order: [['sort_order', 'ASC']],
        });
    }
    async findById(id) {
        return this.boqSectionModel.findByPk(id);
    }
};
exports.BoqSectionService = BoqSectionService;
exports.BoqSectionService = BoqSectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(boq_section_model_1.BoqSection)),
    __metadata("design:paramtypes", [Object])
], BoqSectionService);
//# sourceMappingURL=boq-section.service.js.map