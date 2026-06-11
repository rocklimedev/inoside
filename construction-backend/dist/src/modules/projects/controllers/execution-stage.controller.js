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
exports.ExecutionStageController = void 0;
const common_1 = require("@nestjs/common");
const execution_stage_service_1 = require("../services/execution-stage.service");
const create_stage_dto_1 = require("../dto/create-stage.dto");
const update_stage_dto_1 = require("../dto/update-stage.dto");
let ExecutionStageController = class ExecutionStageController {
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
    async findOne(id) {
        return this.service.findOne(id);
    }
    async update(id, dto, req) {
        return this.service.update(id, dto, req.user?.id);
    }
    async reorderStages(projectId, body, req) {
        await this.service.reorderStages(projectId, body.stageIds, req.user?.id);
        return {
            success: true,
            message: 'Stages reordered successfully',
        };
    }
    async remove(id, req) {
        await this.service.remove(id, req.user?.id);
        return {
            success: true,
            message: 'Stage deleted successfully',
        };
    }
};
exports.ExecutionStageController = ExecutionStageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stage_dto_1.CreateExecutionStageDto, Object]),
    __metadata("design:returntype", Promise)
], ExecutionStageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionStageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionStageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_stage_dto_1.UpdateExecutionStageDto, Object]),
    __metadata("design:returntype", Promise)
], ExecutionStageController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('project/:projectId/reorder'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ExecutionStageController.prototype, "reorderStages", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExecutionStageController.prototype, "remove", null);
exports.ExecutionStageController = ExecutionStageController = __decorate([
    (0, common_1.Controller)('execution/stages'),
    __metadata("design:paramtypes", [execution_stage_service_1.ExecutionStageService])
], ExecutionStageController);
//# sourceMappingURL=execution-stage.controller.js.map