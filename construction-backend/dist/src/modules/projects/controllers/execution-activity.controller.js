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
exports.ExecutionActivityController = void 0;
const common_1 = require("@nestjs/common");
const execution_activity_service_1 = require("../services/execution-activity.service");
const create_activity_dto_1 = require("../dto/create-activity.dto");
const update_activity_dto_1 = require("../dto/update-activity.dto");
let ExecutionActivityController = class ExecutionActivityController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto, req) {
        return this.service.create(dto, req.user?.id);
    }
    async findAll(projectId) {
        return this.service.findAll(projectId);
    }
    async findByStage(stageId) {
        return this.service.findByStage(stageId);
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
    async update(id, dto, req) {
        return this.service.update(id, dto, req.user?.id);
    }
    async reorderActivities(stageId, body, req) {
        await this.service.reorderActivities(stageId, body.activityIds, req.user?.id);
        return {
            success: true,
            message: 'Activities reordered successfully',
        };
    }
    async remove(id, req) {
        await this.service.remove(id, req.user?.id);
        return {
            success: true,
            message: 'Activity deleted successfully',
        };
    }
};
exports.ExecutionActivityController = ExecutionActivityController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activity_dto_1.CreateExecutionActivityDto, Object]),
    __metadata("design:returntype", Promise)
], ExecutionActivityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionActivityController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stage/:stageId'),
    __param(0, (0, common_1.Param)('stageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionActivityController.prototype, "findByStage", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionActivityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_activity_dto_1.UpdateExecutionActivityDto, Object]),
    __metadata("design:returntype", Promise)
], ExecutionActivityController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('stage/:stageId/reorder'),
    __param(0, (0, common_1.Param)('stageId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ExecutionActivityController.prototype, "reorderActivities", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExecutionActivityController.prototype, "remove", null);
exports.ExecutionActivityController = ExecutionActivityController = __decorate([
    (0, common_1.Controller)('execution/activities'),
    __metadata("design:paramtypes", [execution_activity_service_1.ExecutionActivityService])
], ExecutionActivityController);
//# sourceMappingURL=execution-activity.controller.js.map