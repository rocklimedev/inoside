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
const inventory_master_model_1 = require("./models/inventory-master.model");
const inventory_request_model_1 = require("./models/inventory-request.model");
const inventory_dispatch_model_1 = require("./models/inventory-dispatch.model");
const materials_model_1 = require("./models/materials.model");
const inventory_master_service_1 = require("./services/inventory-master.service");
const inventory_request_service_1 = require("./services/inventory-request.service");
const inventory_dispatch_service_1 = require("./services/inventory-dispatch.service");
const inventory_request_controller_1 = require("./inventory-request.controller");
const inventory_disptach_controller_1 = require("./inventory-disptach.controller");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                inventory_master_model_1.InventoryMaster,
                inventory_request_model_1.InventoryRequest,
                inventory_dispatch_model_1.InventoryDispatch,
                materials_model_1.Material,
            ]),
        ],
        controllers: [inventory_request_controller_1.InventoryRequestController, inventory_disptach_controller_1.InventoryDispatchController],
        providers: [
            inventory_master_service_1.InventoryMasterService,
            inventory_request_service_1.InventoryRequestService,
            inventory_dispatch_service_1.InventoryDispatchService,
        ],
        exports: [
            inventory_master_service_1.InventoryMasterService,
            inventory_request_service_1.InventoryRequestService,
            inventory_dispatch_service_1.InventoryDispatchService,
        ],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map