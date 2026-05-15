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
exports.Boq = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("../../projects/models/project.model");
const boq_category_model_1 = require("./boq-category.model");
const boq_section_model_1 = require("./boq-section.model");
const user_model_1 = require("../../users/models/user.model");
let Boq = class Boq extends sequelize_typescript_1.Model {
};
exports.Boq = Boq;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Boq.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => boq_category_model_1.BoqCategory),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Boq.prototype, "boq_category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Boq.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        defaultValue: 'Rev-01',
    }),
    __metadata("design:type", Object)
], Boq.prototype, "revision_no", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('draft', 'submitted', 'approved', 'rejected', 'revised'),
        defaultValue: 'draft',
    }),
    __metadata("design:type", Object)
], Boq.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(16, 2),
        defaultValue: 0,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "subtotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(16, 2),
        defaultValue: 0,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "tax_amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(16, 2),
        defaultValue: 0,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "grand_total", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "prepared_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Boq.prototype, "approved_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project),
    __metadata("design:type", Object)
], Boq.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => boq_category_model_1.BoqCategory),
    __metadata("design:type", Object)
], Boq.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => boq_section_model_1.BoqSection),
    __metadata("design:type", Object)
], Boq.prototype, "sections", void 0);
exports.Boq = Boq = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'boqs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], Boq);
//# sourceMappingURL=boq.model.js.map