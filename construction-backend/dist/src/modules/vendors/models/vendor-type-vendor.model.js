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
exports.VendorTypeVendor = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const vendor_model_1 = require("./vendor.model");
const vendor_type_model_1 = require("./vendor-type.model");
let VendorTypeVendor = class VendorTypeVendor extends sequelize_typescript_1.Model {
};
exports.VendorTypeVendor = VendorTypeVendor;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => vendor_model_1.Vendor),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], VendorTypeVendor.prototype, "vendor_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => vendor_type_model_1.VendorType),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], VendorTypeVendor.prototype, "type_id", void 0);
exports.VendorTypeVendor = VendorTypeVendor = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'vendor_type_vendor',
        timestamps: false,
    })
], VendorTypeVendor);
//# sourceMappingURL=vendor-type-vendor.model.js.map