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
let ClientsService = class ClientsService {
    clientModel;
    constructor(clientModel) {
        this.clientModel = clientModel;
    }
    async create(dto) {
        if (dto.email) {
            const existing = await this.clientModel.findOne({
                where: { email: dto.email },
            });
            if (existing) {
                throw new common_1.ConflictException('Client with this email already exists');
            }
        }
        return this.clientModel.create(dto);
    }
    async findAll() {
        return this.clientModel.findAll({
            order: [['created_at', 'DESC']],
        });
    }
    async findOne(id) {
        const client = await this.clientModel.findByPk(id);
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return client;
    }
    async update(id, dto) {
        const client = await this.findOne(id);
        if (dto.email) {
            const existing = await this.clientModel.findOne({
                where: { email: dto.email },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        await client.update(dto);
        return client;
    }
    async remove(id) {
        const client = await this.findOne(id);
        await client.destroy();
        return {
            message: 'Client deleted successfully',
        };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(client_model_1.Client)),
    __metadata("design:paramtypes", [Object])
], ClientsService);
//# sourceMappingURL=clients.service.js.map