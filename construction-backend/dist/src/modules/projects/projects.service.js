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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const project_model_1 = require("./models/project.model");
const client_model_1 = require("../clients/models/client.model");
const site_model_1 = require("../sites/models/site.model");
const user_model_1 = require("../users/models/user.model");
const address_model_1 = require("../address/models/address.model");
let ProjectsService = class ProjectsService {
    projectModel;
    clientModel;
    siteModel;
    userModel;
    constructor(projectModel, clientModel, siteModel, userModel) {
        this.projectModel = projectModel;
        this.clientModel = clientModel;
        this.siteModel = siteModel;
        this.userModel = userModel;
    }
    getIncludes() {
        return [
            {
                model: client_model_1.Client,
                attributes: ['id', 'name', 'contact_number', 'email'],
            },
            {
                model: site_model_1.Site,
                as: 'site',
                include: [
                    {
                        model: address_model_1.Address,
                        as: 'address',
                    },
                ],
            },
            {
                model: user_model_1.User,
                as: 'creator',
                attributes: ['id', 'name', 'email'],
            },
        ];
    }
    async create(dto) {
        if (dto.client_id) {
            const client = await this.clientModel.findByPk(dto.client_id);
            if (!client) {
                throw new common_1.BadRequestException('Client not found');
            }
        }
        if (dto.site_id) {
            const site = await this.siteModel.findByPk(dto.site_id);
            if (!site) {
                throw new common_1.BadRequestException('Site not found');
            }
        }
        if (dto.created_by) {
            const user = await this.userModel.findByPk(dto.created_by);
            if (!user) {
                throw new common_1.BadRequestException('Creator user not found');
            }
        }
        const project = await this.projectModel.create(dto);
        return this.findOne(project.id);
    }
    async findAll() {
        return this.projectModel.findAll({
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async findOne(id) {
        const project = await this.projectModel.findByPk(id, {
            include: this.getIncludes(),
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, dto) {
        const project = await this.findOne(id);
        if (dto.client_id) {
            const client = await this.clientModel.findByPk(dto.client_id);
            if (!client) {
                throw new common_1.BadRequestException('Client not found');
            }
        }
        if (dto.site_id) {
            const site = await this.siteModel.findByPk(dto.site_id);
            if (!site) {
                throw new common_1.BadRequestException('Site not found');
            }
        }
        await project.update(dto);
        return this.findOne(id);
    }
    async remove(id) {
        const project = await this.findOne(id);
        await project.destroy();
        return {
            success: true,
            message: 'Project deleted successfully',
        };
    }
    async updateProgress(id, progress) {
        if (progress < 0 || progress > 100) {
            throw new common_1.BadRequestException('Progress must be between 0 and 100');
        }
        const project = await this.findOne(id);
        await project.update({
            progress_percentage: progress,
        });
        return this.findOne(id);
    }
    async assignProject(id, dto) {
        const project = await this.findOne(id);
        const user = await this.userModel.findByPk(dto.assigned_to);
        if (!user) {
            throw new common_1.NotFoundException('Assigned user not found');
        }
        await project.update({
            assigned_to: dto.assigned_to,
        });
        return this.findOne(id);
    }
    async archiveProject(id) {
        const project = await this.findOne(id);
        await project.update({
            is_archived: true,
        });
        return this.findOne(id);
    }
    async unarchiveProject(id) {
        const project = await this.findOne(id);
        await project.update({
            is_archived: false,
        });
        return this.findOne(id);
    }
    async getProjectsByClient(clientId) {
        return this.projectModel.findAll({
            where: {
                client_id: clientId,
            },
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async getProjectsByStatus(status) {
        return this.projectModel.findAll({
            where: {
                status,
            },
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async getProjectsByUser(userId) {
        return this.projectModel.findAll({
            where: {
                [sequelize_2.Op.or]: [{ created_by: userId }, { assigned_to: userId }],
            },
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async searchProjects(query) {
        return this.projectModel.findAll({
            where: {
                [sequelize_2.Op.or]: [
                    {
                        name: {
                            [sequelize_2.Op.iLike]: `%${query}%`,
                        },
                    },
                    {
                        description: {
                            [sequelize_2.Op.iLike]: `%${query}%`,
                        },
                    },
                ],
            },
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async getActiveProjects() {
        return this.projectModel.findAll({
            where: {
                is_archived: false,
            },
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async getArchivedProjects() {
        return this.projectModel.findAll({
            where: {
                is_archived: true,
            },
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async getProjectStats() {
        const total = await this.projectModel.count();
        const active = await this.projectModel.count({
            where: {
                is_archived: false,
            },
        });
        const archived = await this.projectModel.count({
            where: {
                is_archived: true,
            },
        });
        const completed = await this.projectModel.count({
            where: {
                status: 'Completed',
            },
        });
        const inProgress = await this.projectModel.count({
            where: {
                status: 'In Progress',
            },
        });
        return {
            total,
            active,
            archived,
            completed,
            inProgress,
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __param(1, (0, sequelize_1.InjectModel)(client_model_1.Client)),
    __param(2, (0, sequelize_1.InjectModel)(site_model_1.Site)),
    __param(3, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map