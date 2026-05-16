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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(dto) {
        return this.projectsService.create(dto);
    }
    findAll() {
        return this.projectsService.findAll();
    }
    findOne(id) {
        return this.projectsService.findOne(id);
    }
    update(id, dto) {
        return this.projectsService.update(id, dto);
    }
    remove(id) {
        return this.projectsService.remove(id);
    }
    updateProgress(id, progress) {
        return this.projectsService.updateProgress(id, progress);
    }
    createBrief(id, dto) {
        return this.projectsService.createBrief({
            ...dto,
            project_id: id,
        });
    }
    getBrief(id) {
        return this.projectsService.getBrief(id);
    }
    updateBrief(id, dto) {
        return this.projectsService.updateBrief(id, dto);
    }
    getAllBriefs() {
        return this.projectsService.getAllBriefs();
    }
    getBriefById(briefId) {
        return this.projectsService.getBriefById(briefId);
    }
    createPitch(id, dto) {
        return this.projectsService.createPitch({
            ...dto,
            project_id: id,
        });
    }
    getPitch(id) {
        return this.projectsService.getPitch(id);
    }
    updatePitch(id, dto) {
        return this.projectsService.updatePitch(id, dto);
    }
    addPitchReference(id, dto) {
        return this.projectsService.addPitchReference({
            ...dto,
            project_id: id,
        });
    }
    getPitchReferences(id) {
        return this.projectsService.getPitchReferences(id);
    }
    deletePitchReference(refId) {
        return this.projectsService.deletePitchReference(refId);
    }
    createReki(id, dto) {
        return this.projectsService.createReki({
            ...dto,
            project_id: id,
        });
    }
    getReki(id) {
        return this.projectsService.getReki(id);
    }
    updateReki(id, dto) {
        return this.projectsService.updateReki(id, dto);
    }
    addRekiPhoto(id, dto) {
        return this.projectsService.addRekiPhoto({
            ...dto,
            project_id: id,
        });
    }
    getRekiPhotos(rekiId) {
        return this.projectsService.getRekiPhotos(rekiId);
    }
    deleteRekiPhoto(photoId) {
        return this.projectsService.deleteRekiPhoto(photoId);
    }
    createScope(id, dto) {
        return this.projectsService.createScope({
            ...dto,
            project_id: id,
        });
    }
    getScope(id) {
        return this.projectsService.getScope(id);
    }
    updateScope(id, dto) {
        return this.projectsService.updateScope(id, dto);
    }
    addCostEstimate(id, dto) {
        return this.projectsService.addCostEstimate({
            ...dto,
            project_id: id,
        });
    }
    getCostEstimates(id) {
        return this.projectsService.getCostEstimates(id);
    }
    updateCostEstimate(estimateId, dto) {
        return this.projectsService.updateCostEstimate(estimateId, dto);
    }
    uploadDrawing(id, dto) {
        return this.projectsService.uploadDrawing({
            ...dto,
            project_id: id,
        });
    }
    getDrawings(id) {
        return this.projectsService.getDrawings(id);
    }
    approveDrawing(drawingId, user_id) {
        return this.projectsService.approveDrawing(drawingId, user_id);
    }
    addApprovalLog(drawingId, dto) {
        return this.projectsService.addApprovalLog({
            ...dto,
            drawing_id: drawingId,
        });
    }
    getApprovalLogs(drawingId) {
        return this.projectsService.getApprovalLogs(drawingId);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/progress'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('progress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Post)(':id/brief'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createBrief", null);
__decorate([
    (0, common_1.Get)(':id/brief'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getBrief", null);
__decorate([
    (0, common_1.Patch)(':id/brief'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateBrief", null);
__decorate([
    (0, common_1.Get)('briefs/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getAllBriefs", null);
__decorate([
    (0, common_1.Get)('briefs/:briefId'),
    __param(0, (0, common_1.Param)('briefId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getBriefById", null);
__decorate([
    (0, common_1.Post)(':id/pitch'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createPitch", null);
__decorate([
    (0, common_1.Get)(':id/pitch'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getPitch", null);
__decorate([
    (0, common_1.Patch)(':id/pitch'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updatePitch", null);
__decorate([
    (0, common_1.Post)(':id/pitch-references'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addPitchReference", null);
__decorate([
    (0, common_1.Get)(':id/pitch-references'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getPitchReferences", null);
__decorate([
    (0, common_1.Delete)('pitch-references/:refId'),
    __param(0, (0, common_1.Param)('refId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "deletePitchReference", null);
__decorate([
    (0, common_1.Post)(':id/reki'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createReki", null);
__decorate([
    (0, common_1.Get)(':id/reki'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getReki", null);
__decorate([
    (0, common_1.Patch)(':id/reki'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateReki", null);
__decorate([
    (0, common_1.Post)(':id/reki/photos'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addRekiPhoto", null);
__decorate([
    (0, common_1.Get)('reki/:rekiId/photos'),
    __param(0, (0, common_1.Param)('rekiId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getRekiPhotos", null);
__decorate([
    (0, common_1.Delete)('reki/photos/:photoId'),
    __param(0, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "deleteRekiPhoto", null);
__decorate([
    (0, common_1.Post)(':id/scope'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createScope", null);
__decorate([
    (0, common_1.Get)(':id/scope'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getScope", null);
__decorate([
    (0, common_1.Patch)(':id/scope'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateScope", null);
__decorate([
    (0, common_1.Post)(':id/cost-estimates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addCostEstimate", null);
__decorate([
    (0, common_1.Get)(':id/cost-estimates'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getCostEstimates", null);
__decorate([
    (0, common_1.Patch)('cost-estimates/:estimateId'),
    __param(0, (0, common_1.Param)('estimateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateCostEstimate", null);
__decorate([
    (0, common_1.Post)(':id/drawings'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "uploadDrawing", null);
__decorate([
    (0, common_1.Get)(':id/drawings'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getDrawings", null);
__decorate([
    (0, common_1.Patch)('drawings/:drawingId/approve'),
    __param(0, (0, common_1.Param)('drawingId')),
    __param(1, (0, common_1.Body)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "approveDrawing", null);
__decorate([
    (0, common_1.Post)('drawings/:drawingId/logs'),
    __param(0, (0, common_1.Param)('drawingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addApprovalLog", null);
__decorate([
    (0, common_1.Get)('drawings/:drawingId/logs'),
    __param(0, (0, common_1.Param)('drawingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getApprovalLogs", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map