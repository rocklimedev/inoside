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
exports.ScopeOfWorkService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const scope_of_work_model_1 = require("../models/scope_of_work.model");
const project_model_1 = require("../models/project.model");
const client_model_1 = require("../../clients/models/client.model");
const site_model_1 = require("../../sites/models/site.model");
const user_model_1 = require("../../users/models/user.model");
const address_model_1 = require("../../address/models/address.model");
let ScopeOfWorkService = class ScopeOfWorkService {
    scopeModel;
    projectModel;
    constructor(scopeModel, projectModel) {
        this.scopeModel = scopeModel;
        this.projectModel = projectModel;
    }
    getIncludes() {
        return [
            {
                model: project_model_1.Project,
                attributes: [
                    'id',
                    'name',
                    'status',
                    'progress_percentage',
                    'current_stage',
                ],
                include: [
                    {
                        model: client_model_1.Client,
                        attributes: ['id', 'name', 'email', 'contact_number'],
                    },
                    {
                        model: site_model_1.Site,
                        as: 'site',
                        attributes: [
                            'id',
                            'ownership_status',
                            'access_available',
                            'existing_structure',
                        ],
                        include: [
                            {
                                model: address_model_1.Address,
                                as: 'address',
                                attributes: [
                                    'id',
                                    'line1',
                                    'line2',
                                    'landmark',
                                    'city',
                                    'state',
                                    'country',
                                    'pincode',
                                    'latitude',
                                    'longitude',
                                    'google_map_link',
                                ],
                            },
                        ],
                    },
                    {
                        model: user_model_1.User,
                        as: 'creator',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            },
        ];
    }
    sanitizeScopeData(dto) {
        return {
            ...dto,
            scope_summary: dto.scope_summary?.trim() || null,
            civil_works: Array.isArray(dto.civil_works) ? dto.civil_works : [],
            mep_works: Array.isArray(dto.mep_works) ? dto.mep_works : [],
            interior_works: Array.isArray(dto.interior_works)
                ? dto.interior_works
                : [],
            finishes: Array.isArray(dto.finishes) ? dto.finishes : [],
            area_summary: Array.isArray(dto.area_summary) ? dto.area_summary : [],
            scope_pdf_url: dto.scope_pdf_url?.trim() || null,
        };
    }
    async create(dto) {
        const project = await this.projectModel.findByPk(dto.project_id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const exists = await this.scopeModel.findOne({
            where: { project_id: dto.project_id },
        });
        if (exists) {
            throw new common_1.BadRequestException('Scope of Work already exists for this project');
        }
        const sanitizedData = this.sanitizeScopeData(dto);
        const scope = await this.scopeModel.create(sanitizedData);
        await project.update({
            status: 'scope_done',
            current_stage: 'Scope of Work Created',
            progress_percentage: 40,
        });
        return this.findById(scope.id);
    }
    async update(projectId, dto) {
        const scope = await this.scopeModel.findOne({
            where: { project_id: projectId },
        });
        if (!scope) {
            throw new common_1.NotFoundException('Scope of Work not found');
        }
        const sanitizedData = this.sanitizeScopeData(dto);
        await scope.update(sanitizedData);
        return this.findByProject(projectId);
    }
    async findByProject(projectId) {
        const scope = await this.scopeModel.findOne({
            where: { project_id: projectId },
            include: this.getIncludes(),
        });
        if (!scope) {
            throw new common_1.NotFoundException('Scope of Work not found');
        }
        return scope;
    }
    async findById(id) {
        const scope = await this.scopeModel.findByPk(id, {
            include: this.getIncludes(),
        });
        if (!scope) {
            throw new common_1.NotFoundException('Scope of Work not found');
        }
        return scope;
    }
    async findAll() {
        return this.scopeModel.findAll({
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async delete(id) {
        const scope = await this.scopeModel.findByPk(id);
        if (!scope) {
            throw new common_1.NotFoundException('Scope of Work not found');
        }
        await scope.destroy();
        return { success: true, message: 'Scope of Work deleted successfully' };
    }
    async markApproved(projectId) {
        const scope = await this.findByProject(projectId);
        const project = await this.projectModel.findByPk(projectId);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await project.update({
            current_stage: 'Scope Approved',
            progress_percentage: 45,
        });
        return scope;
    }
    async markRejected(projectId, reason) {
        const scope = await this.findByProject(projectId);
        const project = await this.projectModel.findByPk(projectId);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await project.update({
            current_stage: 'Scope Revisions Required',
        });
        return { scope, rejection_reason: reason || null };
    }
};
exports.ScopeOfWorkService = ScopeOfWorkService;
exports.ScopeOfWorkService = ScopeOfWorkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(scope_of_work_model_1.ScopeOfWork)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __metadata("design:paramtypes", [Object, Object])
], ScopeOfWorkService);
//# sourceMappingURL=scope-of-work.service.js.map