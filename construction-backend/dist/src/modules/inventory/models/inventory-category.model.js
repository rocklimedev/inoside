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
exports.InventoryCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let InventoryCategory = class InventoryCategory extends sequelize_typescript_1.Model {
};
exports.InventoryCategory = InventoryCategory;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], InventoryCategory.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], InventoryCategory.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
    }),
    __metadata("design:type", String)
], InventoryCategory.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => InventoryCategory),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryCategory.prototype, "parent_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => InventoryCategory, 'parent_id'),
    __metadata("design:type", InventoryCategory)
], InventoryCategory.prototype, "parent", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => InventoryCategory, 'parent_id'),
    __metadata("design:type", Array)
], InventoryCategory.prototype, "children", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], InventoryCategory.prototype, "sort_order", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
    }),
    __metadata("design:type", Boolean)
], InventoryCategory.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], InventoryCategory.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], InventoryCategory.prototype, "updated_at", void 0);
exports.InventoryCategory = InventoryCategory = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'inventory_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], InventoryCategory);
//# sourceMappingURL=inventory-category.model.js.map