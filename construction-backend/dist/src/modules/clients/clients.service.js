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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const client_model_1 = require("./models/client.model");
const client_engagement_service_1 = require("../engagement/services/client-engagement.service");
let ClientsService = class ClientsService {
    clientModel;
    clientEngagementService;
    constructor(clientModel, clientEngagementService) {
        this.clientModel = clientModel;
        this.clientEngagementService = clientEngagementService;
    }
    async create(dto, actor) {
        if (dto.email) {
            const existing = await this.clientModel.findOne({
                where: { email: dto.email },
            });
            if (existing) {
                await this.clientEngagementService.duplicateEmailAttempt(actor, dto.email);
                throw new common_1.ConflictException('Client with this email already exists');
            }
        }
        const client = await this.clientModel.create(dto);
        await this.clientEngagementService.clientCreated(actor, {
            id: client.id,
            name: client.name,
            email: client.email ?? undefined,
        });
        return client;
    }
    async findAll(actor) {
        const clients = await this.clientModel.findAll({
            order: [['created_at', 'DESC']],
        });
        return clients;
    }
    async findOne(id, actor) {
        const client = await this.clientModel.findByPk(id);
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        if (actor) {
            await this.clientEngagementService.clientViewed(actor, client);
        }
        return client;
    }
    async update(id, dto, actor) {
        const client = await this.findOne(id);
        if (dto.email) {
            const existing = await this.clientModel.findOne({
                where: { email: dto.email },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        const oldValues = { ...client.get() };
        await client.update(dto);
        await this.clientEngagementService.clientUpdated(actor, client, oldValues, dto);
        return client;
    }
    async remove(id, actor) {
        const client = await this.findOne(id);
        await client.destroy();
        await this.clientEngagementService.clientDeleted(actor, client);
        return {
            message: 'Client deleted successfully',
        };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(client_model_1.Client)),
    __metadata("design:paramtypes", [Object, client_engagement_service_1.ClientEngagementService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map