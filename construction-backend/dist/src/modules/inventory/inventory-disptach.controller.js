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
exports.InventoryDispatchController = void 0;
const common_1 = require("@nestjs/common");
const inventory_dispatch_service_1 = require("./services/inventory-dispatch.service");
const dispatch_material_dto_1 = require("./dto/dispatch-material.dto");
let InventoryDispatchController = class InventoryDispatchController {
    service;
    constructor(service) {
        this.service = service;
    }
    dispatch(dto) {
        return this.service.dispatch(dto);
    }
    markDelivered(id, qty) {
        return this.service.markDelivered(id, qty);
    }
};
exports.InventoryDispatchController = InventoryDispatchController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dispatch_material_dto_1.DispatchMaterialDto]),
    __metadata("design:returntype", void 0)
], InventoryDispatchController.prototype, "dispatch", null);
__decorate([
    (0, common_1.Patch)(':id/delivered'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('received_quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], InventoryDispatchController.prototype, "markDelivered", null);
exports.InventoryDispatchController = InventoryDispatchController = __decorate([
    (0, common_1.Controller)('inventory/dispatch'),
    __metadata("design:paramtypes", [inventory_dispatch_service_1.InventoryDispatchService])
], InventoryDispatchController);
//# sourceMappingURL=inventory-disptach.controller.js.map