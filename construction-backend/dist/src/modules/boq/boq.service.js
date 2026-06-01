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
const uuid_1 = require("uuid");
const boq_model_1 = require("./models/boq.model");
const boq_category_model_1 = require("./models/boq-category.model");
const boq_section_model_1 = require("./models/boq-section.model");
const boq_subheading_model_1 = require("./models/boq-subheading.model");
const boq_item_model_1 = require("./models/boq-item.model");
const unit_model_1 = require("./models/unit.model");
const project_model_1 = require("../projects/models/project.model");
const client_model_1 = require("../clients/models/client.model");
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
        const boq = await this.boqModel.create({
            ...dto,
            project_id: dto.project_id || null,
            client_id: dto.client_id || null,
        });
        return this.getBoqWithDetails(boq.id);
    }
    async updateBoq(id, dto) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq) {
            throw new common_1.NotFoundException('BOQ not found');
        }
        if (dto.boq_category_id) {
            const category = await this.boqCategoryModel.findByPk(dto.boq_category_id);
            if (!category) {
                throw new common_1.NotFoundException('BOQ category not found');
            }
        }
        if (dto.project_id) {
            const project = await project_model_1.Project.findByPk(dto.project_id);
            if (!project) {
                throw new common_1.NotFoundException('Project not found');
            }
        }
        if (dto.client_id) {
            const client = await client_model_1.Client.findByPk(dto.client_id);
            if (!client) {
                throw new common_1.NotFoundException('Client not found');
            }
        }
        await boq.update({
            title: dto.title ?? boq.title,
            notes: dto.notes ?? boq.notes,
            code: dto.code ?? boq.code,
            revision_no: dto.revision_no ?? boq.revision_no,
            boq_category_id: dto.boq_category_id !== undefined
                ? dto.boq_category_id
                : boq.boq_category_id,
            project_id: dto.project_id !== undefined ? dto.project_id : boq.project_id,
            client_id: dto.client_id !== undefined ? dto.client_id : boq.client_id,
            prepared_by: dto.prepared_by !== undefined ? dto.prepared_by : boq.prepared_by,
        });
        return this.getBoqWithDetails(id);
    }
    async findAllBoqs(projectId, clientId) {
        const where = {};
        if (projectId) {
            where.project_id = projectId;
        }
        if (clientId) {
            where.client_id = clientId;
        }
        return this.boqModel.findAll({
            where,
            include: [
                {
                    model: project_model_1.Project,
                    attributes: ['id', 'name'],
                },
                {
                    model: client_model_1.Client,
                    attributes: ['id', 'name', 'contact_number'],
                },
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
    async updateBoqStatus(id, data) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq) {
            throw new common_1.NotFoundException('BOQ not found');
        }
        await boq.update({
            status: data.status,
            approved_by: data.status === 'approved'
                ? (data.approved_by ?? boq.approved_by)
                : boq.approved_by,
        });
        return this.getBoqWithDetails(id);
    }
    async getBoqWithDetails(id) {
        const boq = await this.boqModel.findByPk(id, {
            include: [
                {
                    model: project_model_1.Project,
                    attributes: ['id', 'name'],
                },
                {
                    model: client_model_1.Client,
                    attributes: ['id', 'name', 'contact_number'],
                },
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
    async getBoqsByClient(clientId) {
        const client = await client_model_1.Client.findByPk(clientId);
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        return this.boqModel.findAll({
            where: {
                client_id: clientId,
            },
            include: [
                {
                    model: project_model_1.Project,
                    attributes: ['id', 'name'],
                },
                {
                    model: client_model_1.Client,
                    attributes: ['id', 'name', 'contact_number', 'email'],
                },
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
    async createSection(dto) {
        await this.validateBoqExists(dto.boq_id);
        return this.boqSectionModel.create(dto);
    }
    async updateSection(id, dto) {
        const section = await this.boqSectionModel.findByPk(id);
        if (!section) {
            throw new common_1.NotFoundException('Section not found');
        }
        await section.update({
            title: dto.title ?? section.title,
            description: dto.description ?? section.description,
            sort_order: dto.sort_order ?? section.sort_order,
        });
        return section;
    }
    async deleteSection(id) {
        const section = await this.boqSectionModel.findByPk(id);
        if (!section) {
            throw new common_1.NotFoundException('Section not found');
        }
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
    async updateSubHeading(id, dto) {
        const subheading = await this.boqSubHeadingModel.findByPk(id);
        if (!subheading) {
            throw new common_1.NotFoundException('Subheading not found');
        }
        await subheading.update({
            title: dto.title ?? subheading.title,
            description: dto.description ?? subheading.description,
            sort_order: dto.sort_order ?? subheading.sort_order,
        });
        return subheading;
    }
    async deleteSubHeading(id) {
        const subheading = await this.boqSubHeadingModel.findByPk(id);
        if (!subheading) {
            throw new common_1.NotFoundException('Subheading not found');
        }
        await subheading.destroy();
        return { message: 'Subheading deleted successfully' };
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
    async resolveUnitId(unitInput) {
        if (!unitInput?.trim()) {
            return null;
        }
        const trimmed = unitInput.trim();
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
        if (uuidRegex.test(trimmed)) {
            return trimmed;
        }
        const unit = await this.unitModel.findOne({
            where: {
                short_name: trimmed.toLowerCase(),
            },
        });
        if (unit) {
            return unit.id;
        }
        console.warn(`⚠️ Unit with short_name "${trimmed}" not found.`);
        return null;
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
        const finalUnitId = await this.resolveUnitId(dto.unit_id);
        let inventoryMasterId;
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
            inventoryMasterId = master.id;
        }
        else {
            const existingMaster = await this.inventoryMasterModel.findByPk(dto.inventory_master_id);
            if (!existingMaster)
                throw new common_1.NotFoundException('Inventory master item not found');
            inventoryMasterId = existingMaster.id;
        }
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
        await this.calculateBoqTotal(dto.boq_id);
        return this.boqItemModel.findByPk(item.id, {
            include: [unit_model_1.Unit, { model: inventory_master_model_1.InventoryMaster, include: [brand_model_1.Brand] }],
        });
    }
    async updateItem(id, updateData) {
        const item = await this.boqItemModel.findByPk(id);
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
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
        await this.calculateBoqTotal(item.boq_id);
        return this.boqItemModel.findByPk(id, {
            include: [unit_model_1.Unit, { model: inventory_master_model_1.InventoryMaster, include: [brand_model_1.Brand] }],
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
    async deleteBoq(id) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq) {
            throw new common_1.NotFoundException('BOQ not found');
        }
        await this.boqItemModel.destroy({
            where: { boq_id: id },
        });
        await this.boqSubHeadingModel.destroy({
            where: { boq_id: id },
        });
        await this.boqSectionModel.destroy({
            where: { boq_id: id },
        });
        await boq.destroy();
        return {
            message: 'BOQ deleted successfully',
        };
    }
    async calculateBoqTotal(boqId) {
        const items = await this.boqItemModel.findAll({
            where: { boq_id: boqId },
        });
        const subtotal = items.reduce((sum, item) => {
            const baseAmount = Number(item.qty || 0) * Number(item.rate || 0);
            return sum + baseAmount;
        }, 0);
        await this.boqModel.update({
            subtotal,
            grand_total: subtotal,
        }, { where: { id: boqId } });
        return { subtotal, grand_total: subtotal };
    }
    async validateBoqExists(id) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq) {
            throw new common_1.NotFoundException('BOQ not found');
        }
        return boq;
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