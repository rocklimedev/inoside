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
exports.BoqItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const boq_model_1 = require("./boq.model");
const boq_section_model_1 = require("./boq-section.model");
const boq_subheading_model_1 = require("./boq-subheading.model");
const unit_model_1 = require("./unit.model");
const inventory_master_model_1 = require("../../inventory/models/inventory-master.model");
let BoqItem = class BoqItem extends sequelize_typescript_1.Model {
};
exports.BoqItem = BoqItem;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => boq_model_1.Boq),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.CHAR(36), allowNull: false }),
    __metadata("design:type", String)
], BoqItem.prototype, "boq_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => boq_section_model_1.BoqSection),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.CHAR(36), allowNull: false }),
    __metadata("design:type", String)
], BoqItem.prototype, "section_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => boq_subheading_model_1.BoqSubHeading),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.CHAR(36), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "subheading_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => inventory_master_model_1.InventoryMaster),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.CHAR(36), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "inventory_master_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => unit_model_1.Unit),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.CHAR(36), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "unit_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "sno", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "item_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false }),
    __metadata("design:type", String)
], BoqItem.prototype, "item_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "specification", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "brand", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(14, 3), defaultValue: 0 }),
    __metadata("design:type", Object)
], BoqItem.prototype, "qty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(14, 2), defaultValue: 0 }),
    __metadata("design:type", Object)
], BoqItem.prototype, "rate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), defaultValue: 0 }),
    __metadata("design:type", Object)
], BoqItem.prototype, "wastage_percent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), defaultValue: 0 }),
    __metadata("design:type", Object)
], BoqItem.prototype, "discount_percent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), defaultValue: 18 }),
    __metadata("design:type", Object)
], BoqItem.prototype, "tax_percent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(16, 2), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "base_amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(16, 2), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "tax_amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(16, 2), allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "final_amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", Object)
], BoqItem.prototype, "remarks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 }),
    __metadata("design:type", Object)
], BoqItem.prototype, "sort_order", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => boq_model_1.Boq),
    __metadata("design:type", Object)
], BoqItem.prototype, "boq", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => boq_section_model_1.BoqSection),
    __metadata("design:type", Object)
], BoqItem.prototype, "section", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => boq_subheading_model_1.BoqSubHeading),
    __metadata("design:type", Object)
], BoqItem.prototype, "subheading", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => inventory_master_model_1.InventoryMaster, {
        foreignKey: 'inventory_master_id',
    }),
    __metadata("design:type", Object)
], BoqItem.prototype, "inventory_master", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => unit_model_1.Unit),
    __metadata("design:type", Object)
], BoqItem.prototype, "unit", void 0);
exports.BoqItem = BoqItem = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'boq_items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], BoqItem);
//# sourceMappingURL=boq-item.model.js.map