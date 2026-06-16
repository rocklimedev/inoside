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
exports.InventoryMaster = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const inventory_category_model_1 = require("./inventory-category.model");
const unit_model_1 = require("../../boq/models/unit.model");
const brand_model_1 = require("./brand.model");
let InventoryMaster = class InventoryMaster extends sequelize_typescript_1.Model {
};
exports.InventoryMaster = InventoryMaster;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], InventoryMaster.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], InventoryMaster.prototype, "item_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryMaster.prototype, "item_name", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => inventory_category_model_1.InventoryCategory),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => inventory_category_model_1.InventoryCategory),
    __metadata("design:type", inventory_category_model_1.InventoryCategory)
], InventoryMaster.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => unit_model_1.Unit),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "unit_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => unit_model_1.Unit),
    __metadata("design:type", unit_model_1.Unit)
], InventoryMaster.prototype, "unit", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(14, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], InventoryMaster.prototype, "default_rate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(18.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], InventoryMaster.prototype, "gst_percent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "hsn_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 3),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], InventoryMaster.prototype, "min_stock_level", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "specification", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
    }),
    __metadata("design:type", Boolean)
], InventoryMaster.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
    }),
    __metadata("design:type", Boolean)
], InventoryMaster.prototype, "is_serialized", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], InventoryMaster.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], InventoryMaster.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => brand_model_1.Brand),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryMaster.prototype, "brand_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => brand_model_1.Brand),
    __metadata("design:type", brand_model_1.Brand)
], InventoryMaster.prototype, "brand", void 0);
exports.InventoryMaster = InventoryMaster = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'inventory_master',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], InventoryMaster);
//# sourceMappingURL=inventory-master.model.js.map