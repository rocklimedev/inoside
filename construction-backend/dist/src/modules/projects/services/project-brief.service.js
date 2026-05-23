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
exports.ProjectBriefService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const project_brief_model_1 = require("../models/project_brief.model");
const project_model_1 = require("../models/project.model");
const client_model_1 = require("../../clients/models/client.model");
const site_model_1 = require("../../sites/models/site.model");
const user_model_1 = require("../../users/models/user.model");
const address_model_1 = require("../../address/models/address.model");
let ProjectBriefService = class ProjectBriefService {
    briefModel;
    projectModel;
    userModel;
    constructor(briefModel, projectModel, userModel) {
        this.briefModel = briefModel;
        this.projectModel = projectModel;
        this.userModel = userModel;
    }
    async create(dto) {
        await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
        const exists = await this.briefModel.findOne({
            where: { project_id: dto.project_id },
        });
        if (exists)
            throw new common_1.BadRequestException('Brief already exists for this project');
        return this.briefModel.create({
            ...dto,
            is_approved: false,
            approved_by: null,
            approved_at: null,
        });
    }
    async getBrief(briefId) {
        const brief = await this.briefModel.findOne({
            where: { id: briefId },
            include: [
                {
                    model: project_model_1.Project,
                    attributes: ['id', 'name', 'status'],
                    include: [
                        {
                            model: client_model_1.Client,
                            attributes: ['id', 'name', 'email', 'contact_number'],
                        },
                        {
                            model: site_model_1.Site,
                            attributes: ['id', 'ownership_status', 'access_available'],
                            include: [
                                {
                                    model: address_model_1.Address,
                                    attributes: [
                                        'id',
                                        'line1',
                                        'line2',
                                        'landmark',
                                        'city',
                                        'state',
                                        'country',
                                        'pincode',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: user_model_1.User,
                    as: 'approvedByUser',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });
        if (!brief)
            throw new common_1.NotFoundException('Brief not found');
        const data = brief.toJSON();
        return {
            ...data,
            project_name: data.project?.name || '',
            project_status: data.project?.status || '',
            client_name: data.project?.client?.name || '',
            client_email: data.project?.client?.email || '',
            client_phone: data.project?.client?.contact_number || '',
            project_address: data.project?.site?.address || '',
            project_city: data.project?.site?.city || '',
            approved_by_user: data.approvedByUser || null,
        };
    }
    async updateBrief(project_id, dto) {
        await this.getBrief(project_id);
        await this.briefModel.update(dto, { where: { project_id } });
        return this.getBrief(project_id);
    }
    async approveBrief(briefId, user_id) {
        const brief = await this.briefModel.findByPk(briefId);
        if (!brief)
            throw new common_1.NotFoundException('Brief not found');
        const user = await this.userModel.findByPk(user_id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await brief.update({
            is_approved: true,
            approved_by: user_id,
            approved_at: new Date(),
            status: 'Approved',
        });
        return this.getBriefById(briefId);
    }
    async unapproveBrief(briefId) {
        const brief = await this.briefModel.findByPk(briefId);
        if (!brief)
            throw new common_1.NotFoundException('Brief not found');
        await brief.update({
            is_approved: false,
            approved_by: null,
            approved_at: null,
            status: 'Pending',
        });
        return this.getBriefById(briefId);
    }
    async requestBriefChanges(briefId, dto) {
        const brief = await this.briefModel.findByPk(briefId);
        if (!brief)
            throw new common_1.NotFoundException('Brief not found');
        await brief.update({
            status: 'Changes Requested',
            is_approved: false,
            approved_by: null,
            approved_at: null,
            changes_note: dto.note || null,
            changes_requested_by: dto.requested_by || null,
            changes_requested_at: new Date(),
        });
        return this.getBriefById(briefId);
    }
    async sendBriefToClient(briefId) {
        const brief = await this.briefModel.findByPk(briefId);
        if (!brief)
            throw new common_1.NotFoundException('Brief not found');
        await brief.update({ status: 'sent_to_client' });
        return this.getBriefById(briefId);
    }
    async markBriefAsDraft(briefId) {
        const brief = await this.briefModel.findByPk(briefId);
        if (!brief)
            throw new common_1.NotFoundException('Brief not found');
        await brief.update({
            status: 'draft',
            is_approved: false,
            approved_by: null,
            approved_at: null,
        });
        return this.getBriefById(briefId);
    }
    async getAllBriefs() {
        return this.briefModel.findAll({
            include: [
                {
                    model: project_model_1.Project,
                    attributes: ['id', 'name', 'status'],
                    include: [
                        {
                            model: client_model_1.Client,
                            attributes: ['id', 'name', 'email', 'contact_number'],
                        },
                    ],
                },
                {
                    model: user_model_1.User,
                    as: 'approvedByUser',
                    attributes: ['id', 'name', 'email'],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async getBriefById(id) {
        const brief = await this.briefModel.findByPk(id, {
            include: [
                {
                    model: project_model_1.Project,
                    attributes: ['id', 'name', 'status'],
                    include: [
                        {
                            model: client_model_1.Client,
                            attributes: ['id', 'name', 'email', 'contact_number'],
                        },
                        {
                            model: site_model_1.Site,
                            attributes: ['id', 'ownership_status', 'access_available'],
                            include: [
                                {
                                    model: address_model_1.Address,
                                    attributes: [
                                        'id',
                                        'line1',
                                        'line2',
                                        'landmark',
                                        'city',
                                        'state',
                                        'country',
                                        'pincode',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: user_model_1.User,
                    as: 'approvedByUser',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });
        if (!brief)
            throw new common_1.NotFoundException(`Brief with ID ${id} not found`);
        const data = brief.toJSON();
        return {
            ...data,
            project_name: data.project?.name || '',
            project_status: data.project?.status || '',
            client_name: data.project?.client?.name || '',
            client_email: data.project?.client?.email || '',
            client_phone: data.project?.client?.contact_number || '',
            project_address: data.project?.site?.address || '',
            project_city: data.project?.site?.city || '',
            approved_by_user: data.approvedByUser || null,
        };
    }
};
exports.ProjectBriefService = ProjectBriefService;
exports.ProjectBriefService = ProjectBriefService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(project_brief_model_1.ProjectBrief)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProjectBriefService);
//# sourceMappingURL=project-brief.service.js.map