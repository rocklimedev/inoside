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
exports.ProjectDrawingService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const project_drawings_model_1 = require("../models/project-drawings.model");
const project_model_1 = require("../models/project.model");
const user_model_1 = require("../../users/models/user.model");
const drawing_approval_log_service_1 = require("./drawing-approval-log.service");
let ProjectDrawingService = class ProjectDrawingService {
    drawingModel;
    projectModel;
    userModel;
    approvalLogService;
    constructor(drawingModel, projectModel, userModel, approvalLogService) {
        this.drawingModel = drawingModel;
        this.projectModel = projectModel;
        this.userModel = userModel;
        this.approvalLogService = approvalLogService;
    }
    async upload(dto) {
        await this.projectModel.findByPk(dto.project_id, {
            rejectOnEmpty: true,
        });
        return this.drawingModel.create(dto);
    }
    async findByProject(project_id) {
        return this.drawingModel.findAll({
            where: { project_id },
            order: [['uploaded_at', 'DESC']],
        });
    }
    async approve(id, user_id) {
        const drawing = await this.drawingModel.findByPk(id);
        if (!drawing)
            throw new common_1.NotFoundException('Drawing not found');
        const user = await this.userModel.findByPk(user_id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await drawing.update({
            approved: true,
            approved_by: user_id,
            approval_date: new Date(),
        });
        await this.approvalLogService.create({
            drawing_id: id,
            user_id,
            action: 'APPROVED',
            created_at: new Date(),
        });
        return drawing;
    }
    async delete(id) {
        const deleted = await this.drawingModel.destroy({
            where: { id },
        });
        if (!deleted) {
            throw new common_1.NotFoundException('Drawing not found');
        }
        return { success: true };
    }
};
exports.ProjectDrawingService = ProjectDrawingService;
exports.ProjectDrawingService = ProjectDrawingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(project_drawings_model_1.ProjectDrawing)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, Object, Object, drawing_approval_log_service_1.DrawingApprovalLogService])
], ProjectDrawingService);
//# sourceMappingURL=project-drawing.service.js.map