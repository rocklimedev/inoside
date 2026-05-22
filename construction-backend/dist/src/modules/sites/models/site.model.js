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
exports.Site = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("../../projects/models/project.model");
const address_model_1 = require("../../address/models/address.model");
let Site = class Site extends sequelize_typescript_1.Model {
};
exports.Site = Site;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", Object)
], Site.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => address_model_1.Address),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Site.prototype, "address_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => address_model_1.Address),
    __metadata("design:type", Object)
], Site.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('Owned', 'Rented', 'Under Process'),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Site.prototype, "ownership_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Object)
], Site.prototype, "access_available", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Object)
], Site.prototype, "existing_structure", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Object)
], Site.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Object)
], Site.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => project_model_1.Project),
    __metadata("design:type", Object)
], Site.prototype, "project", void 0);
exports.Site = Site = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'sites',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], Site);
//# sourceMappingURL=site.model.js.map