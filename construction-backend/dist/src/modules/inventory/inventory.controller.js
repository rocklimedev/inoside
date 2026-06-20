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
const unit_service_1 = require("./services/unit.service");
const brand_service_1 = require("./services/brand.service");
const inventory_request_service_1 = require("./services/inventory-request.service");
const inventory_dispatch_service_1 = require("./services/inventory-dispatch.service");
const project_material_service_1 = require("./services/project-material.service");
const create_inventory_request_dto_1 = require("./dto/create-inventory-request.dto");
const update_inventory_request_dto_1 = require("./dto/update-inventory-request.dto");
const create_inventory_dispatch_dto_1 = require("./dto/create-inventory-dispatch.dto");
const update_inventory_dispatch_dto_1 = require("./dto/update-inventory-dispatch.dto");
const create_inventory_master_dto_1 = require("./dto/create-inventory-master.dto");
const update_inventory_master_dto_1 = require("./dto/update-inventory-master.dto");
const create_material_dto_1 = require("./dto/create-material.dto");
const update_material_1 = require("./dto/update-material");
let InventoryController = class InventoryController {
    inventoryService;
    unitService;
    brandService;
    requestService;
    dispatchService;
    projectMaterialService;
    constructor(inventoryService, unitService, brandService, requestService, dispatchService, projectMaterialService) {
        this.inventoryService = inventoryService;
        this.unitService = unitService;
        this.brandService = brandService;
        this.requestService = requestService;
        this.dispatchService = dispatchService;
        this.projectMaterialService = projectMaterialService;
    }
    createUnit(body) {
        return this.unitService.createUnit(body.name, body.short_name);
    }
    findAllUnits() {
        return this.unitService.findAllUnits();
    }
    findUnitByShortName(shortName) {
        return this.unitService.findUnitByShortName(shortName);
    }
    findUnit(id) {
        return this.unitService.findUnitById(id);
    }
    updateUnit(id, body) {
        return this.unitService.updateUnit(id, body.name, body.short_name);
    }
    deleteUnit(id) {
        return this.unitService.deleteUnit(id);
    }
    createRequest(dto) {
        return this.requestService.createRequest(dto);
    }
    findAllRequests() {
        return this.requestService.findAllRequests();
    }
    getPendingRequests() {
        return this.requestService.getPendingRequests();
    }
    findRequest(id) {
        return this.requestService.findRequestById(id);
    }
    updateRequest(id, dto) {
        return this.requestService.updateRequest(id, dto);
    }
    deleteRequest(id) {
        return this.requestService.deleteRequest(id);
    }
    getRequestsByProject(projectId) {
        return this.requestService.getRequestsByProject(projectId);
    }
    createDispatch(dto) {
        return this.dispatchService.createDispatch(dto);
    }
    findAllDispatches() {
        return this.dispatchService.findAllDispatches();
    }
    findDispatch(id) {
        return this.dispatchService.findDispatchById(id);
    }
    updateDispatch(id, dto) {
        return this.dispatchService.updateDispatch(id, dto);
    }
    deleteDispatch(id) {
        return this.dispatchService.deleteDispatch(id);
    }
    createMaster(dto) {
        return this.inventoryService.createMaster(dto);
    }
    findAllMaster() {
        return this.inventoryService.findAllMaster();
    }
    searchInventory(query) {
        return this.inventoryService.searchInventory(query);
    }
    findMaster(id) {
        return this.inventoryService.findMasterById(id);
    }
    updateMaster(id, dto) {
        return this.inventoryService.updateMaster(id, dto);
    }
    deleteMaster(id) {
        return this.inventoryService.deleteMaster(id);
    }
    createProjectMaterial(dto) {
        return this.projectMaterialService.createProjectMaterial(dto);
    }
    findAllProjectMaterials() {
        return this.projectMaterialService.findAllProjectMaterials();
    }
    getPendingMaterials() {
        return this.projectMaterialService.getPendingMaterials();
    }
    findProjectMaterial(id) {
        return this.projectMaterialService.findProjectMaterialById(id);
    }
    updateProjectMaterial(id, dto) {
        return this.projectMaterialService.updateProjectMaterial(id, dto);
    }
    deleteProjectMaterial(id) {
        return this.projectMaterialService.deleteProjectMaterial(id);
    }
    findProjectMaterialsByProject(projectId) {
        return this.projectMaterialService.findProjectMaterialsByProject(projectId);
    }
    getProjectMaterialSummary(projectId) {
        return this.projectMaterialService.getProjectMaterialSummary(projectId);
    }
    getProjectMaterialStatus(projectId) {
        return this.projectMaterialService.getProjectMaterialStatus(projectId);
    }
    getMaterialConsumption(projectId) {
        return this.projectMaterialService.getMaterialConsumption(projectId);
    }
    getProjectInventoryValue(projectId) {
        return this.projectMaterialService.getProjectInventoryValue(projectId);
    }
    getProjectPendingMaterials(projectId) {
        return this.projectMaterialService.getPendingMaterials(projectId);
    }
    getInventoryDashboard() {
        return this.inventoryService.getInventoryDashboard();
    }
    getProjectInventoryDashboard(projectId) {
        return this.inventoryService.getProjectInventoryDashboard(projectId);
    }
    createBrand(body) {
        return this.brandService.createBrand(body.name);
    }
    findAllBrands() {
        return this.brandService.findAllBrands();
    }
    deleteBrand(id) {
        return this.brandService.deleteBrand(id);
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
    (0, common_1.Get)('units/short/:shortName'),
    __param(0, (0, common_1.Param)('shortName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findUnitByShortName", null);
__decorate([
    (0, common_1.Get)('units/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findUnit", null);
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
    (0, common_1.Get)('requests/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getPendingRequests", null);
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
    (0, common_1.Get)('project/:projectId/requests'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getRequestsByProject", null);
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
    (0, common_1.Get)('dispatches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findDispatch", null);
__decorate([
    (0, common_1.Put)('dispatches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_dispatch_dto_1.UpdateInventoryDispatchDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateDispatch", null);
__decorate([
    (0, common_1.Delete)('dispatches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteDispatch", null);
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
    (0, common_1.Get)('master/search/:query'),
    __param(0, (0, common_1.Param)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "searchInventory", null);
__decorate([
    (0, common_1.Get)('master/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findMaster", null);
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
    (0, common_1.Post)('projects/materials'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_material_dto_1.CreateProjectMaterialDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createProjectMaterial", null);
__decorate([
    (0, common_1.Get)('materials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllProjectMaterials", null);
__decorate([
    (0, common_1.Get)('materials/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getPendingMaterials", null);
__decorate([
    (0, common_1.Get)('materials/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findProjectMaterial", null);
__decorate([
    (0, common_1.Put)('projects/materials/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_material_1.UpdateProjectMaterialDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateProjectMaterial", null);
__decorate([
    (0, common_1.Delete)('projects/materials/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteProjectMaterial", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/materials'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findProjectMaterialsByProject", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/materials/summary'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProjectMaterialSummary", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/materials/status'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProjectMaterialStatus", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/materials/consumption'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMaterialConsumption", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/materials/value'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProjectInventoryValue", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/materials/pending'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProjectPendingMaterials", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getInventoryDashboard", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/dashboard'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProjectInventoryDashboard", null);
__decorate([
    (0, common_1.Post)('brands'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Get)('brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAllBrands", null);
__decorate([
    (0, common_1.Delete)('brands/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteBrand", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        unit_service_1.UnitService,
        brand_service_1.BrandService,
        inventory_request_service_1.InventoryRequestService,
        inventory_dispatch_service_1.InventoryDispatchService,
        project_material_service_1.ProjectMaterialService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map