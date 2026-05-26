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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const create_inventory_dispatch_dto_1 = require("./dto/create-inventory-dispatch.dto");
const create_inventory_request_dto_1 = require("./dto/create-inventory-request.dto");
const update_inventory_request_dto_1 = require("./dto/update-inventory-request.dto");
const update_inventory_dispatch_dto_1 = require("./dto/update-inventory-dispatch.dto");
const create_inventory_master_dto_1 = require("./dto/create-inventory-master.dto");
const update_inventory_master_dto_1 = require("./dto/update-inventory-master.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    createUnit(body) {
        return this.inventoryService.createUnit(body.name, body.short_name);
    }
    findAllUnits() {
        return this.inventoryService.findAllUnits();
    }
    findUnit(id) {
        return this.inventoryService.findUnitById(id);
    }
    findUnitByShortName(shortName) {
        return this.inventoryService.findUnitByShortName(shortName);
    }
    updateUnit(id, body) {
        return this.inventoryService.updateUnit(id, body.name, body.short_name);
    }
    deleteUnit(id) {
        return this.inventoryService.deleteUnit(id);
    }
    createRequest(dto) {
        return this.inventoryService.createRequest(dto);
    }
    findAllRequests() {
        return this.inventoryService.findAllRequests();
    }
    findRequest(id) {
        return this.inventoryService.findRequestById(id);
    }
    updateRequest(id, dto) {
        return this.inventoryService.updateRequest(id, dto);
    }
    deleteRequest(id) {
        return this.inventoryService.deleteRequest(id);
    }
    createDispatch(dto) {
        return this.inventoryService.createDispatch(dto);
    }
    findAllDispatches() {
        return this.inventoryService.findAllDispatches();
    }
    updateDispatch(id, dto) {
        return this.inventoryService.updateDispatch(id, dto);
    }
    createMaster(dto) {
        return this.inventoryService.createMaster(dto);
    }
    findAllMaster() {
        return this.inventoryService.findAllMaster();
    }
    updateMaster(id, dto) {
        return this.inventoryService.updateMaster(id, dto);
    }
    deleteMaster(id) {
        return this.inventoryService.deleteMaster(id);
    }
    findMaterials() {
        return this.inventoryService.findAllMaterials();
    }
    findBrands() {
        return this.inventoryService.findAllBrands();
    }
    createBrand(body) {
        return this.inventoryService.createBrand(body.name);
    }
    deleteBrand(id) {
        return this.inventoryService.deleteBrand(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('units'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createUnit", null);
__decorate([
    (0, common_1.Get)('units'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllUnits", null);
__decorate([
    (0, common_1.Get)('units/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findUnit", null);
__decorate([
    (0, common_1.Get)('units/short/:shortName'),
    __param(0, (0, common_1.Param)('shortName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findUnitByShortName", null);
__decorate([
    (0, common_1.Put)('units/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateUnit", null);
__decorate([
    (0, common_1.Delete)('units/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteUnit", null);
__decorate([
    (0, common_1.Post)('requests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_request_dto_1.CreateInventoryRequestDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllRequests", null);
__decorate([
    (0, common_1.Get)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findRequest", null);
__decorate([
    (0, common_1.Put)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_request_dto_1.UpdateInventoryRequestDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateRequest", null);
__decorate([
    (0, common_1.Delete)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteRequest", null);
__decorate([
    (0, common_1.Post)('dispatches'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dispatch_dto_1.CreateInventoryDispatchDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createDispatch", null);
__decorate([
    (0, common_1.Get)('dispatches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllDispatches", null);
__decorate([
    (0, common_1.Put)('dispatches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_dispatch_dto_1.UpdateInventoryDispatchDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateDispatch", null);
__decorate([
    (0, common_1.Post)('master'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_master_dto_1.CreateInventoryMasterDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createMaster", null);
__decorate([
    (0, common_1.Get)('master'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllMaster", null);
__decorate([
    (0, common_1.Put)('master/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_master_dto_1.UpdateInventoryMasterDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateMaster", null);
__decorate([
    (0, common_1.Delete)('master/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteMaster", null);
__decorate([
    (0, common_1.Get)('materials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findMaterials", null);
__decorate([
    (0, common_1.Get)('brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findBrands", null);
__decorate([
    (0, common_1.Post)('brands'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Delete)('brands/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteBrand", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map