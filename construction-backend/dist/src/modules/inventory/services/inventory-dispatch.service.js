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
exports.InventoryDispatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_dispatch_model_1 = require("../models/inventory-dispatch.model");
const inventory_request_model_1 = require("../models/inventory-request.model");
const uuid_1 = require("uuid");
let InventoryDispatchService = class InventoryDispatchService {
    dispatchRepo;
    requestRepo;
    constructor(dispatchRepo, requestRepo) {
        this.dispatchRepo = dispatchRepo;
        this.requestRepo = requestRepo;
    }
    async dispatch(dto) {
        const request = await this.requestRepo.findOne({
            where: { id: dto.request_id },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        const dispatch = this.dispatchRepo.create({
            id: (0, uuid_1.v4)(),
            ...dto,
            dispatch_date: new Date(),
        });
        request.status = 'dispatched';
        await this.requestRepo.save(request);
        return this.dispatchRepo.save(dispatch);
    }
    async markDelivered(dispatchId, received_quantity) {
        const dispatch = await this.dispatchRepo.findOne({
            where: { id: dispatchId },
        });
        if (!dispatch) {
            throw new common_1.NotFoundException('Dispatch not found');
        }
        dispatch.received_quantity = received_quantity;
        dispatch.supervisor_confirmation = true;
        return this.dispatchRepo.save(dispatch);
    }
};
exports.InventoryDispatchService = InventoryDispatchService;
exports.InventoryDispatchService = InventoryDispatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_dispatch_model_1.InventoryDispatch)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_request_model_1.InventoryRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryDispatchService);
//# sourceMappingURL=inventory-dispatch.service.js.map