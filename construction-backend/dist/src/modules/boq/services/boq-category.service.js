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
exports.BoqCategoryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const boq_category_model_1 = require("../models/boq-category.model");
const boq_model_1 = require("../models/boq.model");
let BoqCategoryService = class BoqCategoryService {
    boqCategoryModel;
    constructor(boqCategoryModel) {
        this.boqCategoryModel = boqCategoryModel;
    }
    async findAllCategories() {
        return this.boqCategoryModel.findAll({
            order: [['sort_order', 'ASC']],
            include: [{ model: boq_model_1.Boq }],
        });
    }
    async createCategory(data) {
        return this.boqCategoryModel.create({
            name: data.name,
            code: data.code,
            description: data.description,
            sort_order: data.sort_order ?? 0,
            is_active: true,
        });
    }
    async findById(id) {
        return this.boqCategoryModel.findByPk(id);
    }
};
exports.BoqCategoryService = BoqCategoryService;
exports.BoqCategoryService = BoqCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(boq_category_model_1.BoqCategory)),
    __metadata("design:paramtypes", [Object])
], BoqCategoryService);
//# sourceMappingURL=boq-category.service.js.map