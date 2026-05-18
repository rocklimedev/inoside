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
exports.DrawingApprovalLogService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const drawing_approval_logs_model_1 = require("../models/drawing_approval_logs.model");
const user_model_1 = require("../../users/models/user.model");
let DrawingApprovalLogService = class DrawingApprovalLogService {
    approvalLogModel;
    constructor(approvalLogModel) {
        this.approvalLogModel = approvalLogModel;
    }
    async create(dto) {
        return this.approvalLogModel.create(dto);
    }
    async findByDrawing(drawing_id) {
        return this.approvalLogModel.findAll({
            where: { drawing_id },
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: user_model_1.User,
                    as: 'approver',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });
    }
};
exports.DrawingApprovalLogService = DrawingApprovalLogService;
exports.DrawingApprovalLogService = DrawingApprovalLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(drawing_approval_logs_model_1.DrawingApprovalLog)),
    __metadata("design:paramtypes", [Object])
], DrawingApprovalLogService);
//# sourceMappingURL=drawing-approval-log.service.js.map