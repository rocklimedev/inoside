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
exports.RekiReportService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const reki_reports_model_1 = require("../models/reki_reports.model");
const project_model_1 = require("../models/project.model");
const client_model_1 = require("../../clients/models/client.model");
const site_model_1 = require("../../sites/models/site.model");
const user_model_1 = require("../../users/models/user.model");
let RekiReportService = class RekiReportService {
    rekiModel;
    projectModel;
    constructor(rekiModel, projectModel) {
        this.rekiModel = rekiModel;
        this.projectModel = projectModel;
    }
    getIncludes() {
        return [
            {
                model: project_model_1.Project,
                attributes: ['id', 'name', 'status', 'progress_percentage'],
                include: [
                    {
                        model: client_model_1.Client,
                        attributes: ['id', 'name', 'email', 'contact_number'],
                    },
                    {
                        model: site_model_1.Site,
                        attributes: ['id', 'address', 'city'],
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
    async create(dto) {
        const project = await this.projectModel.findByPk(dto.project_id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const existing = await this.rekiModel.findOne({
            where: {
                project_id: dto.project_id,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Reki Report already exists for this project');
        }
        const reki = await this.rekiModel.create(dto);
        await project.update({
            status: 'reki_pending',
            current_stage: 'Reki Started',
        });
        return this.findById(reki.id);
    }
    async findByProject(projectId) {
        const reki = await this.rekiModel.findOne({
            where: {
                project_id: projectId,
            },
            include: this.getIncludes(),
        });
        if (!reki) {
            throw new common_1.NotFoundException('Reki Report not found');
        }
        return reki;
    }
    async findById(id) {
        const reki = await this.rekiModel.findByPk(id, {
            include: this.getIncludes(),
        });
        if (!reki) {
            throw new common_1.NotFoundException('Reki Report not found');
        }
        return reki;
    }
    async findAll() {
        return this.rekiModel.findAll({
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async update(projectId, dto) {
        const reki = await this.rekiModel.findOne({
            where: {
                project_id: projectId,
            },
        });
        if (!reki) {
            throw new common_1.NotFoundException('Reki Report not found');
        }
        await reki.update(dto);
        return this.findByProject(projectId);
    }
    async delete(id) {
        const reki = await this.rekiModel.findByPk(id);
        if (!reki) {
            throw new common_1.NotFoundException('Reki Report not found');
        }
        await reki.destroy();
        return {
            success: true,
            message: 'Reki Report deleted successfully',
        };
    }
    async markAsDone(projectId) {
        const reki = await this.findByProject(projectId);
        const project = await this.projectModel.findByPk(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        await project.update({
            status: 'reki_done',
            current_stage: 'Reki Completed',
            progress_percentage: 25,
        });
        return this.findByProject(projectId);
    }
    async markAsPending(projectId) {
        const reki = await this.findByProject(projectId);
        const project = await this.projectModel.findByPk(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        await project.update({
            status: 'reki_pending',
            current_stage: 'Reki Pending',
        });
        return reki;
    }
};
exports.RekiReportService = RekiReportService;
exports.RekiReportService = RekiReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(reki_reports_model_1.RekiReport)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __metadata("design:paramtypes", [Object, Object])
], RekiReportService);
//# sourceMappingURL=reki-report.service.js.map