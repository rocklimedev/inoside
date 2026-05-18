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
const project_model_1 = require("./models/project.model");
const client_model_1 = require("../clients/models/client.model");
const site_model_1 = require("../sites/models/site.model");
const user_model_1 = require("../users/models/user.model");
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
    async create(dto) {
        const client = await this.clientModel.findByPk(dto.client_id);
        if (!client) {
            throw new common_1.BadRequestException('Client not found');
        }
        const project = await this.projectModel.create(dto);
        return this.findOne(project.id);
    }
    async findAll() {
        return this.projectModel.findAll({
            include: [
                {
                    model: client_model_1.Client,
                    attributes: ['id', 'name', 'contact_number', 'email'],
                },
                { model: site_model_1.Site, attributes: ['id', 'address', 'city'] },
                { model: user_model_1.User, as: 'creator', attributes: ['id', 'name'] },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async findOne(id) {
        const project = await this.projectModel.findByPk(id, {
            include: [
                {
                    model: client_model_1.Client,
                    attributes: ['id', 'name', 'contact_number', 'email'],
                },
                { model: site_model_1.Site },
                { model: user_model_1.User, as: 'creator', attributes: ['id', 'name', 'email'] },
            ],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, dto) {
        const project = await this.findOne(id);
        await project.update(dto);
        return this.findOne(id);
    }
    async remove(id) {
        const project = await this.findOne(id);
        await project.destroy();
        return { message: 'Project deleted successfully' };
    }
    async updateProgress(id, progress) {
        if (progress < 0 || progress > 100) {
            throw new common_1.BadRequestException('Progress must be between 0 and 100');
        }
        const project = await this.findOne(id);
        await project.update({ progress_percentage: progress });
        return this.findOne(id);
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