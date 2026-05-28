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
exports.PitchCommentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const project_pitch_service_1 = require("../services/project-pitch.service");
let PitchCommentsController = class PitchCommentsController {
    pitchService;
    constructor(pitchService) {
        this.pitchService = pitchService;
    }
    getComments(pitchId) {
        return this.pitchService.getComments(pitchId);
    }
    addComment(pitchId, content, req) {
        return this.pitchService.addComment(pitchId, {
            content,
            user_id: req.user.id,
        });
    }
    updateComment(commentId, dto) {
        return this.pitchService.updateComment(commentId, dto);
    }
    deleteComment(commentId) {
        return this.pitchService.deleteComment(commentId);
    }
};
exports.PitchCommentsController = PitchCommentsController;
__decorate([
    (0, common_1.Get)('pitches/:pitchId/comments'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchCommentsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('pitches/:pitchId/comments'),
    __param(0, (0, common_1.Param)('pitchId')),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PitchCommentsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Patch)('pitches/comments/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PitchCommentsController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)('pitches/comments/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchCommentsController.prototype, "deleteComment", null);
exports.PitchCommentsController = PitchCommentsController = __decorate([
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_pitch_service_1.ProjectPitchService])
], PitchCommentsController);
//# sourceMappingURL=pitch-comments.controller.js.map