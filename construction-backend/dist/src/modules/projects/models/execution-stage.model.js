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
exports.ExecutionStage = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("../../projects/models/project.model");
let ExecutionStage = class ExecutionStage extends sequelize_typescript_1.Model {
};
exports.ExecutionStage = ExecutionStage;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ExecutionStage.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ExecutionStage.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project),
    __metadata("design:type", project_model_1.Project)
], ExecutionStage.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ExecutionStage.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ExecutionStage.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", Date)
], ExecutionStage.prototype, "planned_start_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", Date)
], ExecutionStage.prototype, "planned_end_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", Date)
], ExecutionStage.prototype, "actual_start_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", Date)
], ExecutionStage.prototype, "actual_end_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], ExecutionStage.prototype, "progress_percentage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('pending', 'in_progress', 'completed', 'blocked'),
        defaultValue: 'pending',
    }),
    __metadata("design:type", String)
], ExecutionStage.prototype, "status", void 0);
exports.ExecutionStage = ExecutionStage = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'execution_stages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], ExecutionStage);
//# sourceMappingURL=execution-stage.model.js.map