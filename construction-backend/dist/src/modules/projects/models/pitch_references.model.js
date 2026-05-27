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
exports.PitchReference = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
let PitchReference = class PitchReference extends sequelize_typescript_1.Model {
};
exports.PitchReference = PitchReference;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true }),
    __metadata("design:type", Object)
], PitchReference.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], PitchReference.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('image', 'link', 'portfolio')),
    __metadata("design:type", String)
], PitchReference.prototype, "reference_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], PitchReference.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], PitchReference.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project),
    __metadata("design:type", Object)
], PitchReference.prototype, "project", void 0);
exports.PitchReference = PitchReference = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'pitch_references',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], PitchReference);
//# sourceMappingURL=pitch_references.model.js.map