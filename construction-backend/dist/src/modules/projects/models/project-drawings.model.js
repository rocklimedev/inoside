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
exports.ProjectDrawing = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
const user_model_1 = require("../../users/models/user.model");
const drawing_approval_logs_model_1 = require("./drawing_approval_logs.model");
let ProjectDrawing = class ProjectDrawing extends sequelize_typescript_1.Model {
};
exports.ProjectDrawing = ProjectDrawing;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true }),
    __metadata("design:type", Object)
], ProjectDrawing.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ProjectDrawing.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ProjectDrawing.prototype, "uploaded_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ProjectDrawing.prototype, "approved_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('Design', 'Execution', 'Technical', 'Construction', 'Working')),
    __metadata("design:type", String)
], ProjectDrawing.prototype, "drawing_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProjectDrawing.prototype, "version", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], ProjectDrawing.prototype, "area_floor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], ProjectDrawing.prototype, "file_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], ProjectDrawing.prototype, "approved", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ProjectDrawing.prototype, "approval_date", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project, {
        foreignKey: 'project_id',
        as: 'project',
    }),
    __metadata("design:type", Object)
], ProjectDrawing.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, {
        foreignKey: 'uploaded_by',
        as: 'uploadedBy',
    }),
    __metadata("design:type", Object)
], ProjectDrawing.prototype, "uploadedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, {
        foreignKey: 'approved_by',
        as: 'approvedBy',
    }),
    __metadata("design:type", Object)
], ProjectDrawing.prototype, "approvedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => drawing_approval_logs_model_1.DrawingApprovalLog, {
        foreignKey: 'drawing_id',
        as: 'approvalLogs',
    }),
    __metadata("design:type", Object)
], ProjectDrawing.prototype, "approvalLogs", void 0);
exports.ProjectDrawing = ProjectDrawing = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'project_drawings',
        timestamps: true,
        createdAt: 'uploaded_at',
        updatedAt: false,
    })
], ProjectDrawing);
//# sourceMappingURL=project-drawings.model.js.map