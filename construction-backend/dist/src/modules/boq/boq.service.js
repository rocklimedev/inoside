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
const project_model_1 = require("../projects/models/project.model");
const client_model_1 = require("../clients/models/client.model");
const inventory_master_model_1 = require("../inventory/models/inventory-master.model");
const brand_model_1 = require("../inventory/models/brand.model");
const boq_category_service_1 = require("./services/boq-category.service");
const boq_section_service_1 = require("./services/boq-section.service");
const boq_subheading_service_1 = require("./services/boq-subheading.service");
const boq_item_service_1 = require("./services/boq-item.service");
let BoqService = class BoqService {
    boqModel;
    categoryService;
    sectionService;
    subHeadingService;
    itemService;
    constructor(boqModel, categoryService, sectionService, subHeadingService, itemService) {
        this.boqModel = boqModel;
        this.categoryService = categoryService;
        this.sectionService = sectionService;
        this.subHeadingService = subHeadingService;
        this.itemService = itemService;
    }
    findAllCategories() {
        return this.categoryService.findAllCategories();
    }
    createCategory(data) {
        return this.categoryService.createCategory(data);
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
        if (!boq)
            throw new common_1.NotFoundException('BOQ not found');
        if (dto.boq_category_id) {
            const category = await this.categoryService.findById(dto.boq_category_id);
            if (!category)
                throw new common_1.NotFoundException('BOQ category not found');
        }
        if (dto.project_id) {
            const project = await project_model_1.Project.findByPk(dto.project_id);
            if (!project)
                throw new common_1.NotFoundException('Project not found');
        }
        if (dto.client_id) {
            const client = await client_model_1.Client.findByPk(dto.client_id);
            if (!client)
                throw new common_1.NotFoundException('Client not found');
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
        if (projectId)
            where.project_id = projectId;
        if (clientId)
            where.client_id = clientId;
        return this.boqModel.findAll({
            where,
            include: this.boqIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async updateBoqStatus(id, data) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq)
            throw new common_1.NotFoundException('BOQ not found');
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
            include: this.boqIncludes(),
        });
        if (!boq)
            throw new common_1.NotFoundException('BOQ not found');
        return boq;
    }
    async getBoqsByClient(clientId) {
        const client = await client_model_1.Client.findByPk(clientId);
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return this.boqModel.findAll({
            where: { client_id: clientId },
            include: this.boqIncludes(true),
            order: [['created_at', 'DESC']],
        });
    }
    async deleteBoq(id) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq)
            throw new common_1.NotFoundException('BOQ not found');
        await this.itemService.destroyAllByBoq(id);
        await boq_subheading_model_1.BoqSubHeading.destroy({ where: { boq_id: id } });
        await boq_section_model_1.BoqSection.destroy({ where: { boq_id: id } });
        await boq.destroy();
        return { message: 'BOQ deleted successfully' };
    }
    async validateBoqExists(id) {
        const boq = await this.boqModel.findByPk(id);
        if (!boq)
            throw new common_1.NotFoundException('BOQ not found');
        return boq;
    }
    async calculateBoqTotal(boqId) {
        const items = await this.itemService.findAllByBoq(boqId);
        const subtotal = items.reduce((sum, item) => {
            return sum + Number(item.qty || 0) * Number(item.rate || 0);
        }, 0);
        await this.boqModel.update({ subtotal, grand_total: subtotal }, { where: { id: boqId } });
        return { subtotal, grand_total: subtotal };
    }
    async createSection(dto) {
        await this.validateBoqExists(dto.boq_id);
        return this.sectionService.createSection(dto);
    }
    updateSection(id, dto) {
        return this.sectionService.updateSection(id, dto);
    }
    deleteSection(id) {
        return this.sectionService.deleteSection(id);
    }
    findSectionsByBoq(boqId) {
        return this.sectionService.findSectionsByBoq(boqId);
    }
    async createSubHeading(data) {
        const section = await this.sectionService.findById(data.section_id);
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        return this.subHeadingService.createSubHeading(data);
    }
    updateSubHeading(id, dto) {
        return this.subHeadingService.updateSubHeading(id, dto);
    }
    deleteSubHeading(id) {
        return this.subHeadingService.deleteSubHeading(id);
    }
    findSubHeadingsBySection(sectionId) {
        return this.subHeadingService.findSubHeadingsBySection(sectionId);
    }
    async createItem(dto) {
        await this.validateBoqExists(dto.boq_id);
        const section = await this.sectionService.findById(dto.section_id);
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        let subheadingExists = true;
        if (dto.subheading_id) {
            const subheading = await this.subHeadingService.findById(dto.subheading_id);
            subheadingExists = !!subheading;
        }
        const item = await this.itemService.createItem(dto, subheadingExists);
        await this.calculateBoqTotal(dto.boq_id);
        return item;
    }
    async updateItem(id, updateData) {
        const { updatedItem, boqId } = await this.itemService.updateItem(id, updateData);
        await this.calculateBoqTotal(boqId);
        return updatedItem;
    }
    async deleteItem(id) {
        const { boqId } = await this.itemService.deleteItem(id);
        await this.calculateBoqTotal(boqId);
        return { message: 'Item deleted successfully' };
    }
    boqIncludes(extendedClient = false) {
        return [
            {
                model: project_model_1.Project,
                attributes: ['id', 'name'],
            },
            {
                model: client_model_1.Client,
                attributes: extendedClient
                    ? ['id', 'name', 'contact_number', 'email']
                    : ['id', 'name', 'contact_number'],
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
                                include: [unit_model_1.Unit, { model: inventory_master_model_1.InventoryMaster, include: [brand_model_1.Brand] }],
                            },
                        ],
                    },
                ],
            },
        ];
    }
};
exports.BoqService = BoqService;
exports.BoqService = BoqService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(boq_model_1.Boq)),
    __metadata("design:paramtypes", [Object, boq_category_service_1.BoqCategoryService,
        boq_section_service_1.BoqSectionService,
        boq_subheading_service_1.BoqSubHeadingService,
        boq_item_service_1.BoqItemService])
], BoqService);
//# sourceMappingURL=boq.service.js.map