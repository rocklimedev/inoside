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
const project_brief_service_1 = require("./services/project-brief.service");
const pitch_reference_service_1 = require("./services/pitch-reference.service");
const reki_report_service_1 = require("./services/reki-report.service");
const reki_photo_service_1 = require("./services/reki-photo.service");
const scope_of_work_service_1 = require("./services/scope-of-work.service");
const project_cost_estimate_service_1 = require("./services/project-cost-estimate.service");
const project_drawing_service_1 = require("./services/project-drawing.service");
const drawing_approval_log_service_1 = require("./services/drawing-approval-log.service");
const project_pitch_service_1 = require("./services/project-pitch.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const create_project_brief_dto_1 = require("./dto/create-project-brief.dto");
const update_project_brief_dto_1 = require("./dto/update-project-brief.dto");
const request_brief_changes_dto_1 = require("./dto/request-brief-changes.dto");
const create_project_pitch_dto_1 = require("./dto/create-project-pitch.dto");
const update_project_pitch_dto_1 = require("./dto/update-project-pitch.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let ProjectsController = class ProjectsController {
    projectsService;
    briefService;
    pitchRefService;
    rekiService;
    rekiPhotoService;
    scopeService;
    costService;
    drawingService;
    approvalLogService;
    pitchService;
    constructor(projectsService, briefService, pitchRefService, rekiService, rekiPhotoService, scopeService, costService, drawingService, approvalLogService, pitchService) {
        this.projectsService = projectsService;
        this.briefService = briefService;
        this.pitchRefService = pitchRefService;
        this.rekiService = rekiService;
        this.rekiPhotoService = rekiPhotoService;
        this.scopeService = scopeService;
        this.costService = costService;
        this.drawingService = drawingService;
        this.approvalLogService = approvalLogService;
        this.pitchService = pitchService;
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
        return this.briefService.create({ ...dto, project_id: id });
    }
    getBrief(id) {
        return this.briefService.getBrief(id);
    }
    updateBrief(id, dto) {
        return this.briefService.updateBrief(id, dto);
    }
    approveBrief(briefId, req) {
        const user = req.user;
        return this.briefService.approveBrief(briefId, user.id);
    }
    unapproveBrief(briefId) {
        return this.briefService.unapproveBrief(briefId);
    }
    requestBriefChanges(briefId, dto, req) {
        const user = req.user;
        return this.briefService.requestBriefChanges(briefId, {
            note: dto.note,
            requested_by: user.id,
        });
    }
    sendBriefToClient(briefId) {
        return this.briefService.sendBriefToClient(briefId);
    }
    markBriefAsDraft(briefId) {
        return this.briefService.markBriefAsDraft(briefId);
    }
    getAllBriefs() {
        return this.briefService.getAllBriefs();
    }
    getBriefById(briefId) {
        return this.briefService.getBriefById(briefId);
    }
    createPitch(id, dto, req) {
        const user = req.user;
        return this.pitchService.createPitch(id, {
            ...dto,
            created_by: user.id,
        });
    }
    getPitch(id) {
        return this.pitchService.getPitch(id);
    }
    updatePitch(id, dto) {
        return this.pitchService.updatePitch(id, dto);
    }
    getAllPitches() {
        return this.pitchService.getAllPitches();
    }
    getPitchById(pitchId) {
        return this.pitchService.getPitchById(pitchId);
    }
    deletePitch(pitchId) {
        return this.pitchService.deletePitch(pitchId);
    }
    addPitchComment(pitchId, content, req) {
        const user = req.user;
        return this.pitchService.addComment(pitchId, {
            content,
            user_id: user.id,
        });
    }
    replacePitchFile(pitchId, dto) {
        return this.pitchService.replacePitchFile(pitchId, dto);
    }
    approvePitch(pitchId) {
        return this.pitchService.approvePitch(pitchId);
    }
    rejectPitch(pitchId) {
        return this.pitchService.rejectPitch(pitchId);
    }
    addPitchReference(id, dto) {
        return this.pitchRefService.add({ ...dto, project_id: id });
    }
    getPitchReferences(id) {
        return this.pitchRefService.findByProject(id);
    }
    deletePitchReference(refId) {
        return this.pitchRefService.delete(refId);
    }
    createReki(id, dto) {
        return this.rekiService.create({ ...dto, project_id: id });
    }
    getReki(id) {
        return this.rekiService.findOne(id);
    }
    updateReki(id, dto) {
        return this.rekiService.update(id, dto);
    }
    addRekiPhoto(id, dto) {
        return this.rekiPhotoService.add({ ...dto, project_id: id });
    }
    getRekiPhotos(rekiId) {
        return this.rekiPhotoService.findByReki(rekiId);
    }
    deleteRekiPhoto(photoId) {
        return this.rekiPhotoService.delete(photoId);
    }
    createScope(id, dto) {
        return this.scopeService.create({ ...dto, project_id: id });
    }
    getScope(id) {
        return this.scopeService.findOne(id);
    }
    updateScope(id, dto) {
        return this.scopeService.update(id, dto);
    }
    addCostEstimate(id, dto) {
        return this.costService.add({ ...dto, project_id: id });
    }
    getCostEstimates(id) {
        return this.costService.findByProject(id);
    }
    updateCostEstimate(estimateId, dto) {
        return this.costService.update(estimateId, dto);
    }
    uploadDrawing(id, dto) {
        return this.drawingService.upload({ ...dto, project_id: id });
    }
    getDrawings(id) {
        return this.drawingService.findByProject(id);
    }
    approveDrawing(drawingId, user_id) {
        return this.drawingService.approve(drawingId, user_id);
    }
    addApprovalLog(drawingId, dto) {
        return this.approvalLogService.create({ ...dto, drawing_id: drawingId });
    }
    getApprovalLogs(drawingId) {
        return this.approvalLogService.findByDrawing(drawingId);
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
    __metadata("design:paramtypes", [String, create_project_brief_dto_1.CreateProjectBriefDto]),
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
    __metadata("design:paramtypes", [String, update_project_brief_dto_1.UpdateProjectBriefDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateBrief", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/approve'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Param)('briefId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "approveBrief", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/unapprove'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Param)('briefId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "unapproveBrief", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/request-changes'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Param)('briefId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_brief_changes_dto_1.RequestBriefChangesDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "requestBriefChanges", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/send-to-client'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Param)('briefId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "sendBriefToClient", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/draft'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Param)('briefId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "markBriefAsDraft", null);
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
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_project_pitch_dto_1.CreateProjectPitchDto, Object]),
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
    __metadata("design:paramtypes", [String, update_project_pitch_dto_1.UpdateProjectPitchDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updatePitch", null);
__decorate([
    (0, common_1.Get)('pitches/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getAllPitches", null);
__decorate([
    (0, common_1.Get)('pitches/:pitchId'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getPitchById", null);
__decorate([
    (0, common_1.Delete)('pitches/:pitchId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'project_manager'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "deletePitch", null);
__decorate([
    (0, common_1.Post)('pitches/:pitchId/comments'),
    __param(0, (0, common_1.Param)('pitchId')),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addPitchComment", null);
__decorate([
    (0, common_1.Patch)('pitches/:pitchId/files'),
    __param(0, (0, common_1.Param)('pitchId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "replacePitchFile", null);
__decorate([
    (0, common_1.Patch)('pitches/:pitchId/approve'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "approvePitch", null);
__decorate([
    (0, common_1.Patch)('pitches/:pitchId/reject'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "rejectPitch", null);
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
    __metadata("design:paramtypes", [projects_service_1.ProjectsService,
        project_brief_service_1.ProjectBriefService,
        pitch_reference_service_1.PitchReferenceService,
        reki_report_service_1.RekiReportService,
        reki_photo_service_1.RekiPhotoService,
        scope_of_work_service_1.ScopeOfWorkService,
        project_cost_estimate_service_1.ProjectCostEstimateService,
        project_drawing_service_1.ProjectDrawingService,
        drawing_approval_log_service_1.DrawingApprovalLogService,
        project_pitch_service_1.ProjectPitchService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map