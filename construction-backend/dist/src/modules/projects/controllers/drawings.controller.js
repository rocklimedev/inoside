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
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const project_drawing_service_1 = require("../services/project-drawing.service");
let DrawingsController = class DrawingsController {
    drawingService;
    constructor(drawingService) {
        this.drawingService = drawingService;
    }
    uploadDrawing(projectId, dto) {
        return this.drawingService.upload({
            ...dto,
            project_id: projectId,
        });
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
    (0, common_1.Post)(':id/drawings'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "uploadDrawing", null);
__decorate([
    (0, common_1.Get)(':id/drawings'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "getDrawings", null);
__decorate([
    (0, common_1.Patch)('drawings/:drawingId/approve'),
    __param(0, (0, common_1.Param)('drawingId')),
    __param(1, (0, common_1.Body)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "approveDrawing", null);
__decorate([
    (0, common_1.Delete)('drawings/:drawingId'),
    __param(0, (0, common_1.Param)('drawingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "deleteDrawing", null);
exports.DrawingsController = DrawingsController = __decorate([
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_drawing_service_1.ProjectDrawingService])
], DrawingsController);
//# sourceMappingURL=drawings.controller.js.map