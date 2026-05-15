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
exports.SitesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const site_model_1 = require("./models/site.model");
let SitesService = class SitesService {
    siteModel;
    constructor(siteModel) {
        this.siteModel = siteModel;
    }
    async create(createSiteDto) {
        return this.siteModel.create(createSiteDto);
    }
    async findAll() {
        return this.siteModel.findAll({
            order: [['created_at', 'DESC']],
        });
    }
    async findOne(id) {
        const site = await this.siteModel.findByPk(id);
        if (!site) {
            throw new common_1.NotFoundException(`Site with ID ${id} not found`);
        }
        return site;
    }
    async update(id, updateSiteDto) {
        const site = await this.findOne(id);
        await site.update(updateSiteDto);
        return site;
    }
    async remove(id) {
        const site = await this.findOne(id);
        await site.destroy();
        return { message: 'Site deleted successfully' };
    }
};
exports.SitesService = SitesService;
exports.SitesService = SitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(site_model_1.Site)),
    __metadata("design:paramtypes", [Object])
], SitesService);
//# sourceMappingURL=sites.service.js.map