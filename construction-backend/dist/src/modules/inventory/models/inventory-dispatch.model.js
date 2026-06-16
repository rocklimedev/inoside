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
exports.InventoryDispatch = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const inventory_request_model_1 = require("./inventory-request.model");
let InventoryDispatch = class InventoryDispatch extends sequelize_typescript_1.Model {
};
exports.InventoryDispatch = InventoryDispatch;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.CHAR(36)),
    __metadata("design:type", String)
], InventoryDispatch.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => inventory_request_model_1.InventoryRequest),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.CHAR(36),
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryDispatch.prototype, "request_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => inventory_request_model_1.InventoryRequest),
    __metadata("design:type", inventory_request_model_1.InventoryRequest)
], InventoryDispatch.prototype, "request", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryDispatch.prototype, "dispatch_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 3),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], InventoryDispatch.prototype, "dispatch_quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryDispatch.prototype, "vehicle_challan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryDispatch.prototype, "driver_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryDispatch.prototype, "received_quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
    }),
    __metadata("design:type", Boolean)
], InventoryDispatch.prototype, "damage_shortage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 3),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryDispatch.prototype, "shortage_quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
    }),
    __metadata("design:type", Boolean)
], InventoryDispatch.prototype, "supervisor_confirmation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryDispatch.prototype, "delivery_photo_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], InventoryDispatch.prototype, "remarks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], InventoryDispatch.prototype, "created_at", void 0);
exports.InventoryDispatch = InventoryDispatch = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'inventory_dispatches',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    })
], InventoryDispatch);
//# sourceMappingURL=inventory-dispatch.model.js.map