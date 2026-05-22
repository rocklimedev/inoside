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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawingApprovalLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_drawings_model_1 = require("./project-drawings.model");
const client_model_1 = require("../../clients/models/client.model");
const user_model_1 = require("../../users/models/user.model");
let DrawingApprovalLog = class DrawingApprovalLog extends sequelize_typescript_1.Model {
};
exports.DrawingApprovalLog = DrawingApprovalLog;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_drawings_model_1.ProjectDrawing),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], DrawingApprovalLog.prototype, "drawing_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => client_model_1.Client),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "client_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "approved_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('commented'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('approved', 'rejected', 'revision_requested', 'commented'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], DrawingApprovalLog.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "approved", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "revision_requested", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "remarks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "internal_note", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "attachment_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "drawing_version", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_drawings_model_1.ProjectDrawing),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "drawing", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => client_model_1.Client),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "client", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'approved_by'),
    __metadata("design:type", Object)
], DrawingApprovalLog.prototype, "approver", void 0);
exports.DrawingApprovalLog = DrawingApprovalLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'drawing_approval_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    })
], DrawingApprovalLog);
//# sourceMappingURL=drawing_approval_logs.model.js.map