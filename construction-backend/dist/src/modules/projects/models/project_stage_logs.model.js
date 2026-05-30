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
exports.ProjectStageLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
const project_stage_model_1 = require("./project_stage.model");
const user_model_1 = require("../../users/models/user.model");
let ProjectStageLog = class ProjectStageLog extends sequelize_typescript_1.Model {
};
exports.ProjectStageLog = ProjectStageLog;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true }),
    __metadata("design:type", Object)
], ProjectStageLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], ProjectStageLog.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project),
    __metadata("design:type", Object)
], ProjectStageLog.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_stage_model_1.ProjectStage),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], ProjectStageLog.prototype, "stage_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_stage_model_1.ProjectStage),
    __metadata("design:type", Object)
], ProjectStageLog.prototype, "stage", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true }),
    __metadata("design:type", Object)
], ProjectStageLog.prototype, "actor_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", Object)
], ProjectStageLog.prototype, "actor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('created', 'started', 'updated', 'completed', 'blocked', 'reopened', 'commented', 'assigned', 'entity_linked', 'entity_updated'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProjectStageLog.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectStageLog.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectStageLog.prototype, "meta", void 0);
exports.ProjectStageLog = ProjectStageLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'project_stage_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    })
], ProjectStageLog);
//# sourceMappingURL=project_stage_logs.model.js.map