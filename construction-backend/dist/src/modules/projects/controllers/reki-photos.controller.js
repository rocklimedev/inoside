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
exports.RekiPhotosController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const reki_photo_service_1 = require("../services/reki-photo.service");
let RekiPhotosController = class RekiPhotosController {
    rekiPhotoService;
    constructor(rekiPhotoService) {
        this.rekiPhotoService = rekiPhotoService;
    }
    addPhoto(projectId, dto) {
        return this.rekiPhotoService.add({
            ...dto,
            project_id: projectId,
            reki_report_id: dto.reki_report_id,
        });
    }
    deletePhoto(photoId) {
        return this.rekiPhotoService.delete(photoId);
    }
};
exports.RekiPhotosController = RekiPhotosController;
__decorate([
    (0, common_1.Post)(':id/reki/photos'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RekiPhotosController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Delete)('reki/photos/:photoId'),
    __param(0, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RekiPhotosController.prototype, "deletePhoto", null);
exports.RekiPhotosController = RekiPhotosController = __decorate([
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reki_photo_service_1.RekiPhotoService])
], RekiPhotosController);
//# sourceMappingURL=reki-photos.controller.js.map