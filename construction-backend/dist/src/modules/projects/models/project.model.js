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
exports.Project = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const client_model_1 = require("../../clients/models/client.model");
const site_model_1 = require("../../sites/models/site.model");
const user_model_1 = require("../../users/models/user.model");
const project_brief_model_1 = require("./project_brief.model");
const pitch_references_model_1 = require("./pitch_references.model");
const project_pitch_model_1 = require("./project_pitch.model");
const reki_reports_model_1 = require("./reki_reports.model");
const scope_of_work_model_1 = require("./scope_of_work.model");
const project_cost_estimates_model_1 = require("./project_cost_estimates.model");
const project_drawings_model_1 = require("./project-drawings.model");
let Project = class Project extends sequelize_typescript_1.Model {
};
exports.Project = Project;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => client_model_1.Client),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Project.prototype, "client_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => site_model_1.Site),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "site_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "assigned_to", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('New Construction', 'Renovation', 'Interior Fit-out'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Project.prototype, "project_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('Construction', 'Interior', 'Renovation'),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "service_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('Residential', 'Commercial', 'Mixed'),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "purpose", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "number_of_floors", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "approximate_area_sqft", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "budget_range", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('Immediate', 'Flexible', 'Fixed Date'),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "timeline_expectation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "design_preference", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('brief'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('brief', 'pitch', 'reki_pending', 'reki_done', 'scope_done', 'boq_done', 'design', 'execution', 'vendor_selection', 'inventory', 'quality', 'handover', 'completed', 'cancelled', 'on_hold'),
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Project.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "current_stage", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Project.prototype, "progress_percentage", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Project.prototype, "token_received", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Project.prototype, "is_archived", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Project.prototype, "is_completed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "estimated_start_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "estimated_end_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "actual_start_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "actual_end_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "estimated_budget", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Project.prototype, "final_budget", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => client_model_1.Client),
    __metadata("design:type", Object)
], Project.prototype, "client", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => site_model_1.Site),
    __metadata("design:type", Object)
], Project.prototype, "site", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'created_by'),
    __metadata("design:type", Object)
], Project.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'assigned_to'),
    __metadata("design:type", Object)
], Project.prototype, "assignedUser", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => project_brief_model_1.ProjectBrief),
    __metadata("design:type", Object)
], Project.prototype, "brief", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => project_pitch_model_1.ProjectPitch),
    __metadata("design:type", Object)
], Project.prototype, "pitch", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => reki_reports_model_1.RekiReport),
    __metadata("design:type", Object)
], Project.prototype, "reki", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => scope_of_work_model_1.ScopeOfWork),
    __metadata("design:type", Object)
], Project.prototype, "scope", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => pitch_references_model_1.PitchReference),
    __metadata("design:type", Object)
], Project.prototype, "pitchReferences", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => project_cost_estimates_model_1.ProjectCostEstimate),
    __metadata("design:type", Object)
], Project.prototype, "costEstimates", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => project_drawings_model_1.ProjectDrawing),
    __metadata("design:type", Object)
], Project.prototype, "drawings", void 0);
exports.Project = Project = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'projects',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], Project);
//# sourceMappingURL=project.model.js.map