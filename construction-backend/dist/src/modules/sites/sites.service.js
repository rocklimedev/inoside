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
const uuid_1 = require("uuid");
const site_model_1 = require("./models/site.model");
const address_model_1 = require("../address/models/address.model");
const client_model_1 = require("../clients/models/client.model");
const site_engagement_service_1 = require("../engagement/services/site-engagement.service");
let SitesService = class SitesService {
    siteModel;
    addressModel;
    siteEngagementService;
    constructor(siteModel, addressModel, siteEngagementService) {
        this.siteModel = siteModel;
        this.addressModel = addressModel;
        this.siteEngagementService = siteEngagementService;
    }
    async create(createSiteDto, actor) {
        const address = await this.addressModel.create({
            id: (0, uuid_1.v4)(),
            ...createSiteDto.address,
        });
        const site = await this.siteModel.create({
            id: (0, uuid_1.v4)(),
            client_id: createSiteDto.client_id,
            address_id: address.id,
            ownership_status: createSiteDto.ownership_status,
            access_available: createSiteDto.access_available,
            existing_structure: createSiteDto.existing_structure,
        });
        const createdSite = await this.siteModel.findByPk(site.id, {
            include: [address_model_1.Address, client_model_1.Client],
        });
        await this.siteEngagementService.siteCreated(actor, {
            id: site.id,
            clientId: site.client_id,
        });
        return createdSite;
    }
    async findAll() {
        return this.siteModel.findAll({
            include: [address_model_1.Address, client_model_1.Client],
            order: [['created_at', 'DESC']],
        });
    }
    async findOne(id) {
        const site = await this.siteModel.findByPk(id, {
            include: [address_model_1.Address, client_model_1.Client],
        });
        if (!site) {
            throw new common_1.NotFoundException(`Site with ID ${id} not found`);
        }
        return site;
    }
    async findByClient(clientId) {
        return this.siteModel.findAll({
            where: {
                client_id: clientId,
            },
            include: [address_model_1.Address, client_model_1.Client],
            order: [['created_at', 'DESC']],
        });
    }
    async update(id, updateSiteDto, actor) {
        const site = await this.findOne(id);
        const oldValues = site.toJSON();
        if (updateSiteDto.address) {
            const address = await this.addressModel.findByPk(site.address_id);
            if (address) {
                await address.update(updateSiteDto.address);
            }
        }
        await site.update({
            client_id: updateSiteDto.client_id ?? site.client_id,
            ownership_status: updateSiteDto.ownership_status,
            access_available: updateSiteDto.access_available,
            existing_structure: updateSiteDto.existing_structure,
        });
        const updatedSite = await this.findOne(id);
        await this.siteEngagementService.siteUpdated(actor, {
            id: site.id,
            clientId: site.client_id,
        }, oldValues, updatedSite.toJSON());
        return updatedSite;
    }
    async remove(id, actor) {
        const site = await this.findOne(id);
        await this.siteEngagementService.siteDeleted(actor, {
            id: site.id,
            clientId: site.client_id,
        });
        const addressId = site.address_id;
        await site.destroy();
        if (addressId) {
            await this.addressModel.destroy({
                where: {
                    id: addressId,
                },
            });
        }
        return {
            message: 'Site deleted successfully',
        };
    }
};
exports.SitesService = SitesService;
exports.SitesService = SitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(site_model_1.Site)),
    __param(1, (0, sequelize_1.InjectModel)(address_model_1.Address)),
    __metadata("design:paramtypes", [Object, Object, site_engagement_service_1.SiteEngagementService])
], SitesService);
//# sourceMappingURL=sites.service.js.map