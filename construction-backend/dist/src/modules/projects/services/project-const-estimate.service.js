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
exports.ProjectCostEstimateService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const project_cost_estimates_model_1 = require("./models/project_cost_estimates.model");
const project_model_1 = require("./models/project.model");
let ProjectCostEstimateService = class ProjectCostEstimateService {
    costModel;
    projectModel;
    constructor(costModel, projectModel) {
        this.costModel = costModel;
        this.projectModel = projectModel;
    }
    async add(dto) {
        await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
        return this.costModel.create(dto);
    }
    async findByProject(project_id) {
        return this.costModel.findAll({
            where: { project_id },
            order: [['created_at', 'DESC']],
        });
    }
    async update(id, dto) {
        const estimate = await this.costModel.findByPk(id);
        if (!estimate)
            throw new common_1.NotFoundException('Cost estimate not found');
        await estimate.update(dto);
        return estimate;
    }
    async delete(id) {
        return this.costModel.destroy({ where: { id } });
    }
};
exports.ProjectCostEstimateService = ProjectCostEstimateService;
exports.ProjectCostEstimateService = ProjectCostEstimateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(project_cost_estimates_model_1.ProjectCostEstimate)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __metadata("design:paramtypes", [Object, Object])
], ProjectCostEstimateService);
//# sourceMappingURL=project-const-estimate.service.js.map