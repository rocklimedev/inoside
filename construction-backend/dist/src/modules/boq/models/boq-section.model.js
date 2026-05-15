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
exports.BoqSection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const boq_subheading_model_1 = require("./boq-subheading.model");
const boq_model_1 = require("./boq.model");
let BoqSection = class BoqSection extends sequelize_typescript_1.Model {
};
exports.BoqSection = BoqSection;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], BoqSection.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => boq_model_1.Boq),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], BoqSection.prototype, "boq_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], BoqSection.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], BoqSection.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Object)
], BoqSection.prototype, "sort_order", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => boq_subheading_model_1.BoqSubHeading),
    __metadata("design:type", Object)
], BoqSection.prototype, "subheadings", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => boq_model_1.Boq),
    __metadata("design:type", Object)
], BoqSection.prototype, "boq", void 0);
exports.BoqSection = BoqSection = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'boq_sections',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], BoqSection);
//# sourceMappingURL=boq-section.model.js.map