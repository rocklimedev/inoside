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
const project_brief_model_1 = require("./models/project_brief.model");
const project_pitch_model_1 = require("./models/project_pitch.model");
const pitch_references_model_1 = require("./models/pitch_references.model");
const reki_reports_model_1 = require("./models/reki_reports.model");
const reki_photos_model_1 = require("./models/reki_photos.model");
const scope_of_work_model_1 = require("./models/scope_of_work.model");
const project_cost_estimates_model_1 = require("./models/project_cost_estimates.model");
const project_drawings_model_1 = require("./models/project-drawings.model");
const drawing_approval_logs_model_1 = require("./models/drawing_approval_logs.model");
let ProjectsService = class ProjectsService {
    projectModel;
    clientModel;
    siteModel;
    userModel;
    briefModel;
    pitchModel;
    pitchRefModel;
    rekiModel;
    rekiPhotoModel;
    scopeModel;
    costModel;
    drawingModel;
    approvalLogModel;
    constructor(projectModel, clientModel, siteModel, userModel, briefModel, pitchModel, pitchRefModel, rekiModel, rekiPhotoModel, scopeModel, costModel, drawingModel, approvalLogModel) {
        this.projectModel = projectModel;
        this.clientModel = clientModel;
        this.siteModel = siteModel;
        this.userModel = userModel;
        this.briefModel = briefModel;
        this.pitchModel = pitchModel;
        this.pitchRefModel = pitchRefModel;
        this.rekiModel = rekiModel;
        this.rekiPhotoModel = rekiPhotoModel;
        this.scopeModel = scopeModel;
        this.costModel = costModel;
        this.drawingModel = drawingModel;
        this.approvalLogModel = approvalLogModel;
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
                {
                    model: site_model_1.Site,
                    attributes: ['id', 'address', 'city'],
                },
                {
                    model: user_model_1.User,
                    as: 'creator',
                    attributes: ['id', 'name'],
                },
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
                {
                    model: site_model_1.Site,
                },
                {
                    model: user_model_1.User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email'],
                },
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
    async createBrief(dto) {
        await this.findOne(dto.project_id);
        const exists = await this.briefModel.findOne({
            where: { project_id: dto.project_id },
        });
        if (exists) {
            throw new common_1.BadRequestException('Brief already exists');
        }
        return this.briefModel.create(dto);
    }
    async getBrief(project_id) {
        const brief = await this.briefModel.findOne({ where: { project_id } });
        if (!brief)
            throw new common_1.NotFoundException('Brief not found');
        return brief;
    }
    async updateBrief(project_id, dto) {
        await this.getBrief(project_id);
        await this.briefModel.update(dto, { where: { project_id } });
        return this.getBrief(project_id);
    }
    async createPitch(dto) {
        await this.findOne(dto.project_id);
        await this.pitchModel.create(dto);
        return this.getPitch(dto.project_id);
    }
    async getPitch(project_id) {
        const pitch = await this.pitchModel.findOne({
            where: { project_id },
            include: [pitch_references_model_1.PitchReference],
        });
        if (!pitch)
            throw new common_1.NotFoundException('Pitch not found');
        return pitch;
    }
    async updatePitch(project_id, dto) {
        await this.getPitch(project_id);
        await this.pitchModel.update(dto, { where: { project_id } });
        return this.getPitch(project_id);
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
                            attributes: ['id', 'address', 'city'],
                        },
                    ],
                },
            ],
        });
        if (!brief) {
            throw new common_1.NotFoundException(`Brief with ID ${id} not found`);
        }
        return brief;
    }
    async addPitchReference(dto) {
        await this.findOne(dto.project_id);
        return this.pitchRefModel.create(dto);
    }
    async getPitchReferences(project_id) {
        return this.pitchRefModel.findAll({ where: { project_id } });
    }
    async deletePitchReference(id) {
        return this.pitchRefModel.destroy({ where: { id } });
    }
    async createReki(dto) {
        await this.findOne(dto.project_id);
        const exists = await this.rekiModel.findOne({
            where: { project_id: dto.project_id },
        });
        if (exists) {
            throw new common_1.BadRequestException('Reki already exists');
        }
        return this.rekiModel.create(dto);
    }
    async getReki(project_id) {
        const reki = await this.rekiModel.findOne({ where: { project_id } });
        if (!reki)
            throw new common_1.NotFoundException('Reki not found');
        return reki;
    }
    async updateReki(project_id, dto) {
        await this.getReki(project_id);
        await this.rekiModel.update(dto, { where: { project_id } });
        return this.getReki(project_id);
    }
    async addRekiPhoto(dto) {
        await this.findOne(dto.project_id);
        return this.rekiPhotoModel.create(dto);
    }
    async getRekiPhotos(reki_report_id) {
        return this.rekiPhotoModel.findAll({ where: { reki_report_id } });
    }
    async deleteRekiPhoto(id) {
        return this.rekiPhotoModel.destroy({ where: { id } });
    }
    async createScope(dto) {
        await this.findOne(dto.project_id);
        const exists = await this.scopeModel.findOne({
            where: { project_id: dto.project_id },
        });
        if (exists) {
            throw new common_1.BadRequestException('Scope already exists');
        }
        return this.scopeModel.create(dto);
    }
    async getScope(project_id) {
        const scope = await this.scopeModel.findOne({
            where: { project_id },
        });
        if (!scope)
            throw new common_1.NotFoundException('Scope not found');
        return scope;
    }
    async updateScope(project_id, dto) {
        await this.getScope(project_id);
        await this.scopeModel.update(dto, { where: { project_id } });
        return this.getScope(project_id);
    }
    async addCostEstimate(dto) {
        await this.findOne(dto.project_id);
        return this.costModel.create(dto);
    }
    async getCostEstimates(project_id) {
        return this.costModel.findAll({ where: { project_id } });
    }
    async updateCostEstimate(id, dto) {
        await this.costModel.update(dto, { where: { id } });
        return this.costModel.findByPk(id);
    }
    async uploadDrawing(dto) {
        await this.findOne(dto.project_id);
        return this.drawingModel.create(dto);
    }
    async getDrawings(project_id) {
        return this.drawingModel.findAll({
            where: { project_id },
            order: [['uploaded_at', 'DESC']],
        });
    }
    async approveDrawing(id, user_id) {
        const drawing = await this.drawingModel.findByPk(id);
        if (!drawing)
            throw new common_1.NotFoundException('Drawing not found');
        await drawing.update({
            approved: true,
            approved_by: user_id,
            approval_date: new Date(),
        });
        return drawing;
    }
    async addApprovalLog(dto) {
        return this.approvalLogModel.create(dto);
    }
    async getApprovalLogs(drawing_id) {
        return this.approvalLogModel.findAll({
            where: { drawing_id },
            order: [['created_at', 'DESC']],
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __param(1, (0, sequelize_1.InjectModel)(client_model_1.Client)),
    __param(2, (0, sequelize_1.InjectModel)(site_model_1.Site)),
    __param(3, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(4, (0, sequelize_1.InjectModel)(project_brief_model_1.ProjectBrief)),
    __param(5, (0, sequelize_1.InjectModel)(project_pitch_model_1.ProjectPitch)),
    __param(6, (0, sequelize_1.InjectModel)(pitch_references_model_1.PitchReference)),
    __param(7, (0, sequelize_1.InjectModel)(reki_reports_model_1.RekiReport)),
    __param(8, (0, sequelize_1.InjectModel)(reki_photos_model_1.RekiPhoto)),
    __param(9, (0, sequelize_1.InjectModel)(scope_of_work_model_1.ScopeOfWork)),
    __param(10, (0, sequelize_1.InjectModel)(project_cost_estimates_model_1.ProjectCostEstimate)),
    __param(11, (0, sequelize_1.InjectModel)(project_drawings_model_1.ProjectDrawing)),
    __param(12, (0, sequelize_1.InjectModel)(drawing_approval_logs_model_1.DrawingApprovalLog)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map