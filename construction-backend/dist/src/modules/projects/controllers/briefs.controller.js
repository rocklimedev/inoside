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
exports.BriefsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const project_brief_service_1 = require("../services/project-brief.service");
const create_project_brief_dto_1 = require("../dto/create-project-brief.dto");
const update_project_brief_dto_1 = require("../dto/update-project-brief.dto");
const request_brief_changes_dto_1 = require("../dto/request-brief-changes.dto");
let BriefsController = class BriefsController {
    briefService;
    constructor(briefService) {
        this.briefService = briefService;
    }
    createBrief(id, dto) {
        return this.briefService.create({
            ...dto,
            project_id: id,
        });
    }
    getBrief(id) {
        return this.briefService.getBrief(id);
    }
    updateBrief(id, dto) {
        return this.briefService.updateBrief(id, dto);
    }
    getAllBriefs() {
        return this.briefService.getAllBriefs();
    }
    approveBrief(briefId, req) {
        return this.briefService.approveBrief(briefId, req.user.id);
    }
    unapproveBrief(briefId) {
        return this.briefService.unapproveBrief(briefId);
    }
    requestChanges(briefId, dto, req) {
        return this.briefService.requestBriefChanges(briefId, {
            note: dto.note,
            requested_by: req.user.id,
        });
    }
    sendToClient(briefId) {
        return this.briefService.sendBriefToClient(briefId);
    }
    markDraft(briefId) {
        return this.briefService.markBriefAsDraft(briefId);
    }
};
exports.BriefsController = BriefsController;
__decorate([
    (0, common_1.Post)(':id/brief'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_project_brief_dto_1.CreateProjectBriefDto]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "createBrief", null);
__decorate([
    (0, common_1.Get)(':id/brief'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "getBrief", null);
__decorate([
    (0, common_1.Patch)(':id/brief'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_brief_dto_1.UpdateProjectBriefDto]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "updateBrief", null);
__decorate([
    (0, common_1.Get)('briefs/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "getAllBriefs", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/approve'),
    __param(0, (0, common_1.Param)('briefId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "approveBrief", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/unapprove'),
    __param(0, (0, common_1.Param)('briefId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "unapproveBrief", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/request-changes'),
    __param(0, (0, common_1.Param)('briefId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_brief_changes_dto_1.RequestBriefChangesDto, Object]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "requestChanges", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/send-to-client'),
    __param(0, (0, common_1.Param)('briefId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "sendToClient", null);
__decorate([
    (0, common_1.Patch)('briefs/:briefId/draft'),
    __param(0, (0, common_1.Param)('briefId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BriefsController.prototype, "markDraft", null);
exports.BriefsController = BriefsController = __decorate([
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_brief_service_1.ProjectBriefService])
], BriefsController);
//# sourceMappingURL=briefs.controller.js.map