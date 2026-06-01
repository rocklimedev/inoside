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
exports.DrawingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const project_drawing_service_1 = require("../services/project-drawing.service");
const cdn_service_1 = require("../../cdn/services/cdn.service");
let DrawingsController = class DrawingsController {
    drawingService;
    cdnService;
    constructor(drawingService, cdnService) {
        this.drawingService = drawingService;
        this.cdnService = cdnService;
    }
    async uploadDrawing(projectId, file, body) {
        if (!projectId) {
            throw new common_1.BadRequestException('Project ID is required');
        }
        if (!file) {
            throw new common_1.BadRequestException('PDF file is required');
        }
        const uploaded = await this.cdnService.uploadFile(file);
        return this.drawingService.upload({
            project_id: projectId,
            drawing_type: body.drawing_type,
            version: Number(body.version),
            area_floor: body.area_floor,
            file_url: uploaded.url,
            approved: false,
        });
    }
    getAllDrawings() {
        return this.drawingService.findAll();
    }
    getDrawings(projectId) {
        return this.drawingService.findByProject(projectId);
    }
    approveDrawing(drawingId, userId) {
        return this.drawingService.approve(drawingId, userId);
    }
    deleteDrawing(drawingId) {
        return this.drawingService.delete(drawingId);
    }
};
exports.DrawingsController = DrawingsController;
__decorate([
    (0, common_1.Post)(':projectId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DrawingsController.prototype, "uploadDrawing", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "getAllDrawings", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "getDrawings", null);
__decorate([
    (0, common_1.Patch)(':drawingId/approve'),
    __param(0, (0, common_1.Param)('drawingId')),
    __param(1, (0, common_1.Body)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "approveDrawing", null);
__decorate([
    (0, common_1.Delete)(':drawingId'),
    __param(0, (0, common_1.Param)('drawingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "deleteDrawing", null);
exports.DrawingsController = DrawingsController = __decorate([
    (0, common_1.Controller)('drawings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_drawing_service_1.ProjectDrawingService,
        cdn_service_1.CdnService])
], DrawingsController);
//# sourceMappingURL=drawings.controller.js.map