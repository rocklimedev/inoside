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
exports.BoqCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const boq_model_1 = require("./boq.model");
let BoqCategory = class BoqCategory extends sequelize_typescript_1.Model {
};
exports.BoqCategory = BoqCategory;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], BoqCategory.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], BoqCategory.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        unique: true,
    }),
    __metadata("design:type", Object)
], BoqCategory.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], BoqCategory.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Object)
], BoqCategory.prototype, "sort_order", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Object)
], BoqCategory.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => boq_model_1.Boq),
    __metadata("design:type", Object)
], BoqCategory.prototype, "boqs", void 0);
exports.BoqCategory = BoqCategory = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'boq_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], BoqCategory);
//# sourceMappingURL=boq-category.model.js.map