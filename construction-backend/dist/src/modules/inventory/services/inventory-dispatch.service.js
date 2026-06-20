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
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const inventory_dispatch_model_1 = require("../models/inventory-dispatch.model");
let InventoryDispatchService = class InventoryDispatchService {
    dispatchModel;
    constructor(dispatchModel) {
        this.dispatchModel = dispatchModel;
    }
    async createDispatch(dto) {
        return this.dispatchModel.create({
            id: (0, uuid_1.v4)(),
            ...dto,
        });
    }
    async findAllDispatches() {
        return this.dispatchModel.findAll({
            include: [
                {
                    association: 'request',
                    include: [
                        {
                            association: 'project',
                            include: [
                                { association: 'client' },
                                { association: 'site' },
                                { association: 'creator' },
                            ],
                        },
                    ],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async findDispatchById(id) {
        const dispatch = await this.dispatchModel.findByPk(id, {
            include: [{ all: true, nested: true }],
        });
        if (!dispatch)
            throw new common_1.NotFoundException('Dispatch record not found');
        return dispatch;
    }
    async updateDispatch(id, dto) {
        const dispatch = await this.findDispatchById(id);
        return dispatch.update(dto);
    }
    async deleteDispatch(id) {
        const dispatch = await this.findDispatchById(id);
        await dispatch.destroy();
        return { message: 'Dispatch deleted successfully' };
    }
    async findDispatchesByProject(projectId) {
        return this.dispatchModel.findAll({
            where: { project_id: projectId },
            include: [{ all: true, nested: true }],
            order: [['created_at', 'DESC']],
        });
    }
    async countByProject(projectId) {
        return this.dispatchModel.count({ where: { project_id: projectId } });
    }
    async countTotal() {
        return this.dispatchModel.count();
    }
};
exports.InventoryDispatchService = InventoryDispatchService;
exports.InventoryDispatchService = InventoryDispatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(inventory_dispatch_model_1.InventoryDispatch)),
    __metadata("design:paramtypes", [Object])
], InventoryDispatchService);
//# sourceMappingURL=inventory-dispatch.service.js.map