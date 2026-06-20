"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const inventory_controller_1 = require("./inventory.controller");
const inventory_service_1 = require("./inventory.service");
const unit_service_1 = require("./services/unit.service");
const brand_service_1 = require("./services/brand.service");
const inventory_request_service_1 = require("./services/inventory-request.service");
const inventory_dispatch_service_1 = require("./services/inventory-dispatch.service");
const project_material_service_1 = require("./services/project-material.service");
const inventory_request_model_1 = require("./models/inventory-request.model");
const inventory_dispatch_model_1 = require("./models/inventory-dispatch.model");
const inventory_master_model_1 = require("./models/inventory-master.model");
const project_materials_model_1 = require("./models/project-materials.model");
const inventory_category_model_1 = require("./models/inventory-category.model");
const brand_model_1 = require("./models/brand.model");
const unit_model_1 = require("../boq/models/unit.model");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                inventory_request_model_1.InventoryRequest,
                inventory_dispatch_model_1.InventoryDispatch,
                inventory_master_model_1.InventoryMaster,
                project_materials_model_1.ProjectMaterial,
                inventory_category_model_1.InventoryCategory,
                brand_model_1.Brand,
                unit_model_1.Unit,
            ]),
        ],
        controllers: [inventory_controller_1.InventoryController],
        providers: [
            inventory_service_1.InventoryService,
            unit_service_1.UnitService,
            brand_service_1.BrandService,
            inventory_request_service_1.InventoryRequestService,
            inventory_dispatch_service_1.InventoryDispatchService,
            project_material_service_1.ProjectMaterialService,
        ],
        exports: [
            inventory_service_1.InventoryService,
            unit_service_1.UnitService,
            brand_service_1.BrandService,
            inventory_request_service_1.InventoryRequestService,
            inventory_dispatch_service_1.InventoryDispatchService,
            project_material_service_1.ProjectMaterialService,
        ],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map