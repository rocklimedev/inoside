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
exports.InventoryMasterService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const inventory_master_model_1 = require("../models/inventory-master.model");
const uuid_1 = require("uuid");
let InventoryMasterService = class InventoryMasterService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        return this.repo.create({
            id: (0, uuid_1.v4)(),
            ...dto,
        });
    }
    async findAll() {
        return this.repo.findAll({
            order: [['item_name', 'ASC']],
            include: { all: true },
        });
    }
    async findOne(id) {
        return this.repo.findOne({
            where: { id },
            include: { all: true },
        });
    }
};
exports.InventoryMasterService = InventoryMasterService;
exports.InventoryMasterService = InventoryMasterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(inventory_master_model_1.InventoryMaster)),
    __metadata("design:paramtypes", [Object])
], InventoryMasterService);
//# sourceMappingURL=inventory-master.service.js.map