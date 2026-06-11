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
exports.ExecutionActivityService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const execution_activity_model_1 = require("../models/execution-activity.model");
const execution_stage_model_1 = require("../models/execution-stage.model");
const user_model_1 = require("../../users/models/user.model");
let ExecutionActivityService = class ExecutionActivityService {
    activityModel;
    constructor(activityModel) {
        this.activityModel = activityModel;
    }
    async create(dto, userId) {
        return await this.activityModel.create({
            id: (0, uuid_1.v4)(),
            created_by: userId,
            ...dto,
        });
    }
    async findAll(projectId) {
        return await this.activityModel.findAll({
            where: {
                project_id: projectId,
            },
            include: [
                {
                    model: execution_stage_model_1.ExecutionStage,
                },
                {
                    model: user_model_1.User,
                    as: 'createdBy',
                    attributes: ['id', 'first_name', 'last_name', 'email'],
                },
            ],
            order: [['activity_date', 'DESC']],
        });
    }
    async findOne(id) {
        const activity = await this.activityModel.findByPk(id, {
            include: [
                {
                    model: execution_stage_model_1.ExecutionStage,
                },
                {
                    model: user_model_1.User,
                    as: 'createdBy',
                    attributes: ['id', 'first_name', 'last_name', 'email'],
                },
            ],
        });
        if (!activity) {
            throw new common_1.NotFoundException(`Execution activity with ID ${id} not found`);
        }
        return activity;
    }
    async update(id, dto) {
        const activity = await this.findOne(id);
        await activity.update(dto);
        return activity;
    }
    async remove(id) {
        const activity = await this.findOne(id);
        await activity.destroy();
    }
};
exports.ExecutionActivityService = ExecutionActivityService;
exports.ExecutionActivityService = ExecutionActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(execution_activity_model_1.ExecutionActivity)),
    __metadata("design:paramtypes", [Object])
], ExecutionActivityService);
//# sourceMappingURL=execution-activity.service.js.map