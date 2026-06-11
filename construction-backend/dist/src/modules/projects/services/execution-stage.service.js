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
exports.ExecutionStageService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const execution_stage_model_1 = require("../models/execution-stage.model");
let ExecutionStageService = class ExecutionStageService {
    stageModel;
    constructor(stageModel) {
        this.stageModel = stageModel;
    }
    async create(dto) {
        return await this.stageModel.create({
            id: (0, uuid_1.v4)(),
            ...dto,
        });
    }
    async findAll(projectId) {
        return await this.stageModel.findAll({
            where: {
                project_id: projectId,
            },
            order: [['created_at', 'ASC']],
        });
    }
    async findOne(id) {
        const stage = await this.stageModel.findByPk(id);
        if (!stage) {
            throw new common_1.NotFoundException(`Execution stage with ID ${id} not found`);
        }
        return stage;
    }
    async update(id, dto) {
        const stage = await this.findOne(id);
        await stage.update(dto);
        return stage;
    }
    async remove(id) {
        const stage = await this.findOne(id);
        await stage.destroy();
    }
};
exports.ExecutionStageService = ExecutionStageService;
exports.ExecutionStageService = ExecutionStageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(execution_stage_model_1.ExecutionStage)),
    __metadata("design:paramtypes", [Object])
], ExecutionStageService);
//# sourceMappingURL=execution-stage.service.js.map