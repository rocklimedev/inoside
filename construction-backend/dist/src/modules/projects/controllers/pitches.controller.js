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
exports.PitchesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const project_pitch_service_1 = require("../services/project-pitch.service");
const create_project_pitch_dto_1 = require("../dto/create-project-pitch.dto");
const update_project_pitch_dto_1 = require("../dto/update-project-pitch.dto");
let PitchesController = class PitchesController {
    pitchService;
    constructor(pitchService) {
        this.pitchService = pitchService;
    }
    create(projectId, dto, req) {
        return this.pitchService.createPitch(projectId, {
            ...dto,
            created_by: req.user.id,
        });
    }
    get(projectId) {
        return this.pitchService.getPitch(projectId);
    }
    update(projectId, dto) {
        return this.pitchService.updatePitch(projectId, dto);
    }
    remove(projectId) {
        return this.pitchService.deleteByProject(projectId);
    }
    getAll() {
        return this.pitchService.getAllPitches();
    }
    getById(pitchId) {
        return this.pitchService.getPitchById(pitchId);
    }
    deleteById(pitchId) {
        return this.pitchService.deletePitch(pitchId);
    }
    approve(pitchId) {
        return this.pitchService.approvePitch(pitchId);
    }
    reject(pitchId) {
        return this.pitchService.rejectPitch(pitchId);
    }
};
exports.PitchesController = PitchesController;
__decorate([
    (0, common_1.Post)(':id/pitch'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_project_pitch_dto_1.CreateProjectPitchDto, Object]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/pitch'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id/pitch'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_pitch_dto_1.UpdateProjectPitchDto]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id/pitch'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('pitches/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('pitches/:pitchId'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "getById", null);
__decorate([
    (0, common_1.Delete)('pitches/:pitchId'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "deleteById", null);
__decorate([
    (0, common_1.Patch)('pitches/:pitchId/approve'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)('pitches/:pitchId/reject'),
    __param(0, (0, common_1.Param)('pitchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "reject", null);
exports.PitchesController = PitchesController = __decorate([
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_pitch_service_1.ProjectPitchService])
], PitchesController);
//# sourceMappingURL=pitches.controller.js.map