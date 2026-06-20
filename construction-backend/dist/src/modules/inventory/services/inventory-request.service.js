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
exports.InventoryRequestService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const uuid_1 = require("uuid");
const sequelize_2 = require("sequelize");
const inventory_request_model_1 = require("../models/inventory-request.model");
let InventoryRequestService = class InventoryRequestService {
    requestModel;
    constructor(requestModel) {
        this.requestModel = requestModel;
    }
    async createRequest(dto) {
        return this.requestModel.create({
            id: (0, uuid_1.v4)(),
            project_id: dto.project_id,
            project_material_id: dto.project_material_id,
            quantity_required: dto.quantity_required,
            required_date: dto.required_date ?? null,
            vendor_id: dto.vendor_id ?? null,
            source_type: dto.source_type,
            requested_by: dto.requested_by ?? null,
        });
    }
    async findAllRequests() {
        return this.requestModel.findAll({
            include: [
                {
                    association: 'project',
                    include: [
                        { association: 'client' },
                        { association: 'site' },
                        { association: 'creator' },
                        { association: 'assignedUser' },
                    ],
                },
                { association: 'vendor' },
                { association: 'requester' },
                { association: 'approver' },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async getRequestsByProject(projectId) {
        return this.requestModel.findAll({
            where: { project_id: projectId },
            include: [
                {
                    association: 'project',
                    include: [
                        { association: 'client' },
                        { association: 'site' },
                        { association: 'creator' },
                        { association: 'assignedUser' },
                    ],
                },
                { association: 'vendor' },
                { association: 'requester' },
                { association: 'approver' },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async findRequestById(id) {
        const request = await this.requestModel.findByPk(id, {
            include: { all: true, nested: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Inventory request not found');
        return request;
    }
    async updateRequest(id, dto) {
        const request = await this.findRequestById(id);
        return request.update(dto);
    }
    async deleteRequest(id) {
        const request = await this.findRequestById(id);
        await request.destroy();
        return { message: 'Request deleted successfully' };
    }
    async findRequestsByProject(projectId) {
        return this.requestModel.findAll({
            where: { project_id: projectId },
            include: [{ all: true, nested: true }],
            order: [['created_at', 'DESC']],
        });
    }
    async getPendingRequests() {
        return this.requestModel.findAll({
            where: {
                status: {
                    [sequelize_2.Op.in]: ['draft', 'submitted', 'approved'],
                },
            },
            include: [{ all: true, nested: true }],
        });
    }
    async countByProject(projectId) {
        return this.requestModel.count({ where: { project_id: projectId } });
    }
    async countTotal() {
        return this.requestModel.count();
    }
};
exports.InventoryRequestService = InventoryRequestService;
exports.InventoryRequestService = InventoryRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(inventory_request_model_1.InventoryRequest)),
    __metadata("design:paramtypes", [Object])
], InventoryRequestService);
//# sourceMappingURL=inventory-request.service.js.map