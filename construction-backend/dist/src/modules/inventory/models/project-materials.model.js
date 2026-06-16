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
exports.ProjectMaterial = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("../../projects/models/project.model");
const inventory_master_model_1 = require("./inventory-master.model");
const unit_model_1 = require("../../boq/models/unit.model");
const brand_model_1 = require("./brand.model");
let ProjectMaterial = class ProjectMaterial extends sequelize_typescript_1.Model {
};
exports.ProjectMaterial = ProjectMaterial;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.CHAR(36)),
    __metadata("design:type", String)
], ProjectMaterial.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProjectMaterial.prototype, "item_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProjectMaterial.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project),
    __metadata("design:type", project_model_1.Project)
], ProjectMaterial.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => inventory_master_model_1.InventoryMaster),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "inventory_master_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => inventory_master_model_1.InventoryMaster),
    __metadata("design:type", inventory_master_model_1.InventoryMaster)
], ProjectMaterial.prototype, "inventoryMaster", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "item_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "specification", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => unit_model_1.Unit),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "unit_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => unit_model_1.Unit),
    __metadata("design:type", unit_model_1.Unit)
], ProjectMaterial.prototype, "unit", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => brand_model_1.Brand),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "brand_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => brand_model_1.Brand),
    __metadata("design:type", brand_model_1.Brand)
], ProjectMaterial.prototype, "brand", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(14, 3),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ProjectMaterial.prototype, "quantity_estimated", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(14, 3),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ProjectMaterial.prototype, "quantity_required", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(14, 3),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ProjectMaterial.prototype, "quantity_received", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(14, 3),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ProjectMaterial.prototype, "quantity_used", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(14, 2),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "rate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(18.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ProjectMaterial.prototype, "gst_percent", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('planned'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('planned', 'ordered', 'received', 'in_use', 'closed'),
        allowNull: true,
    }),
    __metadata("design:type", String)
], ProjectMaterial.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", Object)
], ProjectMaterial.prototype, "remarks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], ProjectMaterial.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], ProjectMaterial.prototype, "updated_at", void 0);
exports.ProjectMaterial = ProjectMaterial = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'project_materials',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], ProjectMaterial);
//# sourceMappingURL=project-materials.model.js.map