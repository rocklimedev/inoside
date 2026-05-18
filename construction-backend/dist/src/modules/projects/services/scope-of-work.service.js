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
let ScopeOfWorkService = class ScopeOfWorkService {
    scopeModel;
    projectModel;
    constructor(scopeModel, projectModel) {
        this.scopeModel = scopeModel;
        this.projectModel = projectModel;
    }
    async create(dto) {
        await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
        const exists = await this.scopeModel.findOne({
            where: { project_id: dto.project_id },
        });
        if (exists) {
            throw new common_1.BadRequestException('Scope of Work already exists for this project');
        }
        return this.scopeModel.create(dto);
    }
    async findOne(project_id) {
        const scope = await this.scopeModel.findOne({ where: { project_id } });
        if (!scope)
            throw new common_1.NotFoundException('Scope of Work not found');
        return scope;
    }
    async update(project_id, dto) {
        await this.findOne(project_id);
        await this.scopeModel.update(dto, { where: { project_id } });
        return this.findOne(project_id);
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