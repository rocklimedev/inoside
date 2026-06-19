"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const vendors_service_1 = require("./vendors.service");
const vendors_controller_1 = require("./vendors.controller");
const vendor_model_1 = require("./models/vendor.model");
const vendor_type_model_1 = require("./models/vendor-type.model");
const vendor_type_vendor_model_1 = require("./models/vendor-type-vendor.model");
const project_vendor_model_1 = require("./models/project-vendor.model");
const project_model_1 = require("../projects/models/project.model");
const engagement_module_1 = require("../engagement/engagement.module");
let VendorsModule = class VendorsModule {
};
exports.VendorsModule = VendorsModule;
exports.VendorsModule = VendorsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                vendor_model_1.Vendor,
                vendor_type_model_1.VendorType,
                vendor_type_vendor_model_1.VendorTypeVendor,
                project_vendor_model_1.ProjectVendor,
                project_model_1.Project,
            ]),
            engagement_module_1.EngagementModule,
        ],
        controllers: [vendors_controller_1.VendorsController],
        providers: [vendors_service_1.VendorsService],
        exports: [vendors_service_1.VendorsService],
    })
], VendorsModule);
//# sourceMappingURL=vendors.module.js.map