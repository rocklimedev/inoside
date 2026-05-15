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
exports.Unit = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const boq_item_model_1 = require("./boq-item.model");
let Unit = class Unit extends sequelize_typescript_1.Model {
};
exports.Unit = Unit;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], Unit.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Unit.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        unique: true,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Unit.prototype, "short_name", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => boq_item_model_1.BoqItem),
    __metadata("design:type", Object)
], Unit.prototype, "boqItems", void 0);
exports.Unit = Unit = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'units',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], Unit);
//# sourceMappingURL=unit.model.js.map