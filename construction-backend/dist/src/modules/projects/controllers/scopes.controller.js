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
exports.ScopesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const scope_of_work_service_1 = require("../services/scope-of-work.service");
let ScopesController = class ScopesController {
    scopeService;
    constructor(scopeService) {
        this.scopeService = scopeService;
    }
    async create(projectId, dto) {
        if (!projectId) {
            throw new common_1.BadRequestException('Project ID is required');
        }
        return this.scopeService.create({
            ...dto,
            project_id: projectId,
        });
    }
    async find(projectId) {
        if (!projectId) {
            throw new common_1.BadRequestException('Project ID is required');
        }
        return this.scopeService.findByProject(projectId);
    }
    async update(projectId, dto) {
        if (!projectId) {
            throw new common_1.BadRequestException('Project ID is required');
        }
        return this.scopeService.update(projectId, dto);
    }
    async findAll() {
        return this.scopeService.findAll();
    }
    async findById(scopeId) {
        if (!scopeId) {
            throw new common_1.BadRequestException('Scope ID is required');
        }
        return this.scopeService.findById(scopeId);
    }
    async delete(scopeId) {
        if (!scopeId) {
            throw new common_1.BadRequestException('Scope ID is required');
        }
        return this.scopeService.delete(scopeId);
    }
    async markApproved(projectId) {
        if (!projectId) {
            throw new common_1.BadRequestException('Project ID is required');
        }
        return this.scopeService.markApproved(projectId);
    }
    async markRejected(projectId, reason) {
        if (!projectId) {
            throw new common_1.BadRequestException('Project ID is required');
        }
        return this.scopeService.markRejected(projectId, reason);
    }
};
exports.ScopesController = ScopesController;
__decorate([
    (0, common_1.Post)(':id/scope'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/scope'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "find", null);
__decorate([
    (0, common_1.Patch)(':id/scope'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('scopes/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('scopes/:scopeId'),
    __param(0, (0, common_1.Param)('scopeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "findById", null);
__decorate([
    (0, common_1.Delete)('scopes/:scopeId'),
    __param(0, (0, common_1.Param)('scopeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/scope/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "markApproved", null);
__decorate([
    (0, common_1.Patch)(':id/scope/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "markRejected", null);
exports.ScopesController = ScopesController = __decorate([
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [scope_of_work_service_1.ScopeOfWorkService])
], ScopesController);
//# sourceMappingURL=scopes.controller.js.map