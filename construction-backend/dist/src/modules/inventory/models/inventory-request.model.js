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
exports.InventoryRequest = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("../../projects/models/project.model");
const materials_model_1 = require("./materials.model");
const vendor_model_1 = require("../../vendors/models/vendor.model");
const user_model_1 = require("../../users/models/user.model");
let InventoryRequest = class InventoryRequest extends sequelize_typescript_1.Model {
};
exports.InventoryRequest = InventoryRequest;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
    }),
    __metadata("design:type", Object)
], InventoryRequest.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project),
    __metadata("design:type", project_model_1.Project)
], InventoryRequest.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => materials_model_1.Material),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "material_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => materials_model_1.Material),
    __metadata("design:type", materials_model_1.Material)
], InventoryRequest.prototype, "material", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], InventoryRequest.prototype, "quantity_required", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "required_date", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => vendor_model_1.Vendor),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "vendor_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => vendor_model_1.Vendor),
    __metadata("design:type", vendor_model_1.Vendor)
], InventoryRequest.prototype, "vendor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('Vendor', 'Warehouse'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "source_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('requested'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('requested', 'approved', 'dispatched', 'delivered'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "requested_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'requested_by'),
    __metadata("design:type", user_model_1.User)
], InventoryRequest.prototype, "requester", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: true,
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "approved_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'approved_by'),
    __metadata("design:type", user_model_1.User)
], InventoryRequest.prototype, "approver", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Object)
], InventoryRequest.prototype, "created_at", void 0);
exports.InventoryRequest = InventoryRequest = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'inventory_requests',
        timestamps: false,
    })
], InventoryRequest);
//# sourceMappingURL=inventory-request.model.js.map