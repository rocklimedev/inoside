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
exports.ProjectMaterialService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const sequelize_2 = require("sequelize");
const project_materials_model_1 = require("../models/project-materials.model");
const inventory_request_model_1 = require("../models/inventory-request.model");
let ProjectMaterialService = class ProjectMaterialService {
    projectMaterialModel;
    requestModel;
    constructor(projectMaterialModel, requestModel) {
        this.projectMaterialModel = projectMaterialModel;
        this.requestModel = requestModel;
    }
    async createProjectMaterial(dto) {
        const itemName = dto.item_name?.trim();
        const existing = await this.projectMaterialModel.findOne({
            where: {
                project_id: dto.project_id,
                item_name: itemName,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Material "${itemName}" already exists for this project`);
        }
        return this.projectMaterialModel.create({
            id: (0, uuid_1.v4)(),
            item_name: itemName,
            project_id: dto.project_id,
            inventory_master_id: dto.inventory_master_id ?? null,
            item_code: dto.item_code?.trim() || null,
            description: dto.description?.trim() || null,
            specification: dto.specification?.trim() || null,
            unit_id: dto.unit_id ?? null,
            brand_id: dto.brand_id ?? null,
            quantity_estimated: dto.quantity_estimated ?? 0,
            quantity_required: dto.quantity_required ?? 0,
            quantity_received: dto.quantity_received ?? 0,
            quantity_used: dto.quantity_used ?? 0,
            rate: dto.rate ?? null,
            gst_percent: dto.gst_percent ?? 18,
            status: dto.status ?? 'planned',
            remarks: dto.remarks?.trim() || null,
            category: dto.category?.trim() || null,
        });
    }
    async updateProjectMaterial(id, dto) {
        const material = await this.findProjectMaterialById(id);
        if (dto.item_name) {
            const itemName = dto.item_name.trim();
            const existing = await this.projectMaterialModel.findOne({
                where: {
                    project_id: material.project_id,
                    item_name: itemName,
                    id: { [sequelize_2.Op.ne]: id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Material "${itemName}" already exists for this project`);
            }
        }
        return material.update({
            ...(dto.item_name && { item_name: dto.item_name.trim() }),
            ...(dto.inventory_master_id !== undefined && {
                inventory_master_id: dto.inventory_master_id,
            }),
            ...(dto.item_code !== undefined && {
                item_code: dto.item_code?.trim() ?? null,
            }),
            ...(dto.description !== undefined && {
                description: dto.description?.trim() ?? null,
            }),
            ...(dto.specification !== undefined && {
                specification: dto.specification?.trim() ?? null,
            }),
            ...(dto.unit_id !== undefined && { unit_id: dto.unit_id }),
            ...(dto.brand_id !== undefined && { brand_id: dto.brand_id }),
            ...(dto.quantity_estimated !== undefined && {
                quantity_estimated: dto.quantity_estimated,
            }),
            ...(dto.quantity_required !== undefined && {
                quantity_required: dto.quantity_required,
            }),
            ...(dto.quantity_received !== undefined && {
                quantity_received: dto.quantity_received,
            }),
            ...(dto.quantity_used !== undefined && {
                quantity_used: dto.quantity_used,
            }),
            ...(dto.rate !== undefined && { rate: dto.rate }),
            ...(dto.gst_percent !== undefined && { gst_percent: dto.gst_percent }),
            ...(dto.status !== undefined && { status: dto.status }),
            ...(dto.remarks !== undefined && {
                remarks: dto.remarks?.trim() ?? null,
            }),
            ...(dto.category !== undefined && {
                category: dto.category?.trim() ?? null,
            }),
        });
    }
    async deleteProjectMaterial(id) {
        const material = await this.findProjectMaterialById(id);
        const usedInRequests = await this.requestModel.count({
            where: { project_material_id: id },
        });
        if (usedInRequests > 0) {
            throw new common_1.BadRequestException('Cannot delete material: It is referenced by inventory requests');
        }
        await material.destroy();
        return { message: 'Project material deleted successfully' };
    }
    async findAllProjectMaterials() {
        return this.projectMaterialModel.findAll({
            include: ['project', 'inventoryMaster', 'unit', 'brand'],
        });
    }
    async findProjectMaterialsByProject(projectId) {
        return this.projectMaterialModel.findAll({
            where: { project_id: projectId },
            include: ['project', 'inventoryMaster', 'unit', 'brand'],
            order: [['item_name', 'ASC']],
        });
    }
    async findProjectMaterialById(id) {
        const material = await this.projectMaterialModel.findByPk(id, {
            include: ['project', 'inventoryMaster', 'unit', 'brand'],
        });
        if (!material)
            throw new common_1.NotFoundException('Project material not found');
        return material;
    }
    async getProjectMaterialSummary(projectId) {
        const materials = await this.projectMaterialModel.findAll({
            where: { project_id: projectId },
        });
        return {
            totalMaterials: materials.length,
            estimatedQty: materials.reduce((sum, m) => sum + Number(m.quantity_estimated || 0), 0),
            requiredQty: materials.reduce((sum, m) => sum + Number(m.quantity_required || 0), 0),
            receivedQty: materials.reduce((sum, m) => sum + Number(m.quantity_received || 0), 0),
            usedQty: materials.reduce((sum, m) => sum + Number(m.quantity_used || 0), 0),
        };
    }
    async getProjectInventoryValue(projectId) {
        const materials = await this.projectMaterialModel.findAll({
            where: { project_id: projectId },
        });
        const totalValue = materials.reduce((sum, item) => {
            return sum + Number(item.quantity_required || 0) * Number(item.rate || 0);
        }, 0);
        return { projectId, totalValue };
    }
    async getProjectMaterialStatus(projectId) {
        const materials = await this.projectMaterialModel.findAll({
            where: { project_id: projectId },
        });
        return {
            planned: materials.filter((m) => m.status === 'planned').length,
            ordered: materials.filter((m) => m.status === 'ordered').length,
            received: materials.filter((m) => m.status === 'received').length,
            inUse: materials.filter((m) => m.status === 'in_use').length,
            closed: materials.filter((m) => m.status === 'closed').length,
        };
    }
    async getPendingMaterials(projectId) {
        const where = {
            status: { [sequelize_2.Op.in]: ['planned', 'ordered'] },
        };
        if (projectId) {
            where.project_id = projectId;
        }
        return this.projectMaterialModel.findAll({
            where,
            include: ['project', 'inventoryMaster', 'unit', 'brand'],
        });
    }
    async getMaterialConsumption(projectId) {
        const materials = await this.projectMaterialModel.findAll({
            where: { project_id: projectId },
            include: ['inventoryMaster'],
        });
        return materials.map((m) => ({
            id: m.id,
            itemName: m.item_name,
            estimated: m.quantity_estimated,
            required: m.quantity_required,
            received: m.quantity_received,
            used: m.quantity_used,
            balance: Number(m.quantity_received || 0) - Number(m.quantity_used || 0),
        }));
    }
    async countByProject(projectId) {
        return this.projectMaterialModel.count({
            where: { project_id: projectId },
        });
    }
    async countTotal() {
        return this.projectMaterialModel.count();
    }
};
exports.ProjectMaterialService = ProjectMaterialService;
exports.ProjectMaterialService = ProjectMaterialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(project_materials_model_1.ProjectMaterial)),
    __param(1, (0, sequelize_1.InjectModel)(inventory_request_model_1.InventoryRequest)),
    __metadata("design:paramtypes", [Object, Object])
], ProjectMaterialService);
//# sourceMappingURL=project-material.service.js.map