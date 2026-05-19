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
exports.BoqService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const boq_model_1 = require("./models/boq.model");
const boq_category_model_1 = require("./models/boq-category.model");
const boq_section_model_1 = require("./models/boq-section.model");
const boq_subheading_model_1 = require("./models/boq-subheading.model");
const boq_item_model_1 = require("./models/boq-item.model");
const unit_model_1 = require("./models/unit.model");
const inventory_master_model_1 = require("../inventory/models/inventory-master.model");
const brand_model_1 = require("../inventory/models/brand.model");
let BoqService = class BoqService {
    boqModel;
    boqCategoryModel;
    boqSectionModel;
    boqSubHeadingModel;
    boqItemModel;
    unitModel;
    inventoryMasterModel;
    constructor(boqModel, boqCategoryModel, boqSectionModel, boqSubHeadingModel, boqItemModel, unitModel, inventoryMasterModel) {
        this.boqModel = boqModel;
        this.boqCategoryModel = boqCategoryModel;
        this.boqSectionModel = boqSectionModel;
        this.boqSubHeadingModel = boqSubHeadingModel;
        this.boqItemModel = boqItemModel;
        this.unitModel = unitModel;
        this.inventoryMasterModel = inventoryMasterModel;
    }
    async findAllCategories() {
        return this.boqCategoryModel.findAll({
            order: [['sort_order', 'ASC']],
            include: [{ model: boq_model_1.Boq }],
        });
    }
    async createCategory(data) {
        return this.boqCategoryModel.create({
            name: data.name,
            code: data.code,
            description: data.description,
            sort_order: data.sort_order ?? 0,
            is_active: true,
        });
    }
    async createBoq(dto) {
        const boq = await this.boqModel.create(dto);
        return this.getBoqWithDetails(boq.id);
    }
    async findAllBoqs(projectId) {
        return this.boqModel.findAll({
            where: projectId ? { project_id: projectId } : {},
            include: [
                {
                    model: boq_category_model_1.BoqCategory,
                    attributes: ['id', 'name', 'code'],
                },
                {
                    model: boq_section_model_1.BoqSection,
                    include: [
                        {
                            model: boq_subheading_model_1.BoqSubHeading,
                            include: [
                                {
                                    model: boq_item_model_1.BoqItem,
                                    include: [
                                        unit_model_1.Unit,
                                        {
                                            model: inventory_master_model_1.InventoryMaster,
                                            include: [brand_model_1.Brand],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async getBoqWithDetails(id) {
        const boq = await this.boqModel.findByPk(id, {
            include: [
                {
                    model: boq_category_model_1.BoqCategory,
                    attributes: ['id', 'name', 'code'],
                },
                {
                    model: boq_section_model_1.BoqSection,
                    include: [
                        {
                            model: boq_subheading_model_1.BoqSubHeading,
                            include: [
                                {
                                    model: boq_item_model_1.BoqItem,
                                    include: [
                                        unit_model_1.Unit,
                                        {
                                            model: inventory_master_model_1.InventoryMaster,
                                            include: [brand_model_1.Brand],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        if (!boq) {
            throw new common_1.NotFoundException('BOQ not found');
        }
        return boq;
    }
    async validateBoqExists(id) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq) {
            throw new common_1.NotFoundException('BOQ not found');
        }
        return boq;
    }
    async createSection(dto) {
        await this.validateBoqExists(dto.boq_id);
        return this.boqSectionModel.create(dto);
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
                            include: [
                                unit_model_1.Unit,
                                {
                                    model: inventory_master_model_1.InventoryMaster,
                                    include: [brand_model_1.Brand],
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [['sort_order', 'ASC']],
        });
    }
    async createSubHeading(data) {
        const section = await this.boqSectionModel.findByPk(data.section_id);
        if (!section) {
            throw new common_1.NotFoundException('Section not found');
        }
        return this.boqSubHeadingModel.create({
            boq_id: data.boq_id,
            section_id: data.section_id,
            title: data.title,
            description: data.description,
            sort_order: data.sort_order ?? 0,
        });
    }
    async findSubHeadingsBySection(sectionId) {
        return this.boqSubHeadingModel.findAll({
            where: { section_id: sectionId },
            include: [
                {
                    model: boq_item_model_1.BoqItem,
                    include: [
                        unit_model_1.Unit,
                        {
                            model: inventory_master_model_1.InventoryMaster,
                            include: [brand_model_1.Brand],
                        },
                    ],
                },
            ],
            order: [['sort_order', 'ASC']],
        });
    }
    async createItem(dto) {
        const boq = await this.boqModel.findByPk(dto.boq_id);
        if (!boq)
            throw new common_1.NotFoundException('BOQ not found');
        const section = await this.boqSectionModel.findByPk(dto.section_id);
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        if (dto.subheading_id) {
            const subheading = await this.boqSubHeadingModel.findByPk(dto.subheading_id);
            if (!subheading)
                throw new common_1.NotFoundException('Subheading not found');
        }
        let inventory = null;
        if (dto.inventory_item_id) {
            inventory = await this.inventoryMasterModel.findByPk(dto.inventory_item_id);
            if (!inventory)
                throw new common_1.NotFoundException('Inventory item not found');
        }
        const itemName = dto.item_name || inventory?.item_name;
        if (!itemName) {
            throw new common_1.NotFoundException('Item name is required');
        }
        const item = await this.boqItemModel.create({
            ...dto,
            item_code: dto.item_code || inventory?.item_code,
            item_name: itemName,
            description: dto.description || inventory?.description,
            specification: dto.specification || inventory?.specification,
            brand: dto.brand || inventory?.brand_id,
            unit_id: dto.unit_id || inventory?.unit_id,
            rate: dto.rate || inventory?.default_rate,
        });
        await this.calculateBoqTotal(dto.boq_id);
        return this.boqItemModel.findByPk(item.id, {
            include: [
                unit_model_1.Unit,
                {
                    model: inventory_master_model_1.InventoryMaster,
                    include: [brand_model_1.Brand],
                },
            ],
        });
    }
    async updateItem(id, updateData) {
        const item = await this.boqItemModel.findByPk(id);
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        if (updateData.inventory_item_id) {
            const inventoryItem = await this.inventoryMasterModel.findByPk(updateData.inventory_item_id);
            if (!inventoryItem) {
                throw new common_1.NotFoundException('Inventory item not found');
            }
        }
        await item.update(updateData);
        await this.calculateBoqTotal(item.boq_id);
        return this.boqItemModel.findByPk(id, {
            include: [
                unit_model_1.Unit,
                {
                    model: inventory_master_model_1.InventoryMaster,
                    include: [brand_model_1.Brand],
                },
            ],
        });
    }
    async deleteItem(id) {
        const item = await this.boqItemModel.findByPk(id);
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        const boqId = item.boq_id;
        await item.destroy();
        await this.calculateBoqTotal(boqId);
        return {
            message: 'Item deleted successfully',
        };
    }
    async calculateBoqTotal(boqId) {
        const items = await this.boqItemModel.findAll({
            where: { boq_id: boqId },
        });
        const subtotal = items.reduce((sum, item) => {
            return sum + Number(item.final_amount || 0);
        }, 0);
        await this.boqModel.update({
            subtotal,
            grand_total: subtotal,
        }, {
            where: { id: boqId },
        });
        return {
            subtotal,
            grand_total: subtotal,
        };
    }
    async recalculateSectionTotal(sectionId) {
        const items = await this.boqItemModel.findAll({
            where: {
                section_id: sectionId,
            },
        });
        return items.reduce((sum, item) => {
            return sum + Number(item.final_amount || 0);
        }, 0);
    }
};
exports.BoqService = BoqService;
exports.BoqService = BoqService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(boq_model_1.Boq)),
    __param(1, (0, sequelize_1.InjectModel)(boq_category_model_1.BoqCategory)),
    __param(2, (0, sequelize_1.InjectModel)(boq_section_model_1.BoqSection)),
    __param(3, (0, sequelize_1.InjectModel)(boq_subheading_model_1.BoqSubHeading)),
    __param(4, (0, sequelize_1.InjectModel)(boq_item_model_1.BoqItem)),
    __param(5, (0, sequelize_1.InjectModel)(unit_model_1.Unit)),
    __param(6, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], BoqService);
//# sourceMappingURL=boq.service.js.map