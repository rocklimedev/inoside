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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const vendor_model_1 = require("./models/vendor.model");
const vendor_type_model_1 = require("./models/vendor-type.model");
const vendor_type_vendor_model_1 = require("./models/vendor-type-vendor.model");
const project_vendor_model_1 = require("./models/project-vendor.model");
let VendorsService = class VendorsService {
    vendorModel;
    vendorTypeModel;
    vendorTypeVendorModel;
    projectVendorModel;
    constructor(vendorModel, vendorTypeModel, vendorTypeVendorModel, projectVendorModel) {
        this.vendorModel = vendorModel;
        this.vendorTypeModel = vendorTypeModel;
        this.vendorTypeVendorModel = vendorTypeVendorModel;
        this.projectVendorModel = projectVendorModel;
    }
    async createVendor(dto) {
        const { type_ids, ...vendorData } = dto;
        const vendor = await this.vendorModel.create(vendorData);
        if (type_ids?.length) {
            const mappings = type_ids.map((type_id) => ({
                vendor_id: vendor.id,
                type_id,
            }));
            await this.vendorTypeVendorModel.bulkCreate(mappings);
        }
        return this.findVendorById(vendor.id);
    }
    async findAllVendors() {
        return this.vendorModel.findAll({
            include: [
                {
                    model: vendor_type_model_1.VendorType,
                    through: { attributes: [] },
                },
            ],
            order: [['name', 'ASC']],
        });
    }
    async findVendorById(id) {
        const vendor = await this.vendorModel.findByPk(id, {
            include: [
                {
                    model: vendor_type_model_1.VendorType,
                    through: { attributes: [] },
                },
            ],
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async updateVendor(id, dto) {
        const vendor = await this.findVendorById(id);
        const { type_ids, dob, ...vendorData } = dto;
        await vendor.update({
            ...vendorData,
            ...(dob !== undefined && {
                dob: dob ? new Date(dob) : null,
            }),
        });
        if (type_ids) {
            await this.vendorTypeVendorModel.destroy({
                where: { vendor_id: id },
            });
            if (type_ids.length) {
                const mappings = type_ids.map((type_id) => ({
                    vendor_id: id,
                    type_id,
                }));
                await this.vendorTypeVendorModel.bulkCreate(mappings);
            }
        }
        return this.findVendorById(id);
    }
    async deleteVendor(id) {
        const vendor = await this.findVendorById(id);
        await this.vendorTypeVendorModel.destroy({
            where: { vendor_id: id },
        });
        await vendor.destroy();
        return {
            message: 'Vendor deleted successfully',
        };
    }
    async createVendorType(name) {
        const exists = await this.vendorTypeModel.findOne({
            where: { name },
        });
        if (exists) {
            throw new common_1.ConflictException('Vendor type already exists');
        }
        return this.vendorTypeModel.create({ name });
    }
    async getVendorTypes() {
        return this.vendorTypeModel.findAll({
            order: [['name', 'ASC']],
        });
    }
    async assignVendorToProject(dto) {
        const exists = await this.projectVendorModel.findOne({
            where: {
                project_id: dto.project_id,
                vendor_id: dto.vendor_id,
            },
        });
        if (exists) {
            throw new common_1.ConflictException('Vendor already assigned to this project');
        }
        return this.projectVendorModel.create(dto);
    }
    async getVendorsByProject(projectId) {
        return this.projectVendorModel.findAll({
            where: { project_id: projectId },
            include: [
                {
                    model: vendor_model_1.Vendor,
                    include: [
                        {
                            model: vendor_type_model_1.VendorType,
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async updateProjectVendor(id, updateData) {
        const pv = await this.projectVendorModel.findByPk(id);
        if (!pv) {
            throw new common_1.NotFoundException('Project-Vendor record not found');
        }
        await pv.update(updateData);
        return pv;
    }
    async removeVendorFromProject(id) {
        const pv = await this.projectVendorModel.findByPk(id);
        if (!pv) {
            throw new common_1.NotFoundException('Project-Vendor record not found');
        }
        await pv.destroy();
        return {
            message: 'Vendor removed from project successfully',
        };
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(vendor_model_1.Vendor)),
    __param(1, (0, sequelize_1.InjectModel)(vendor_type_model_1.VendorType)),
    __param(2, (0, sequelize_1.InjectModel)(vendor_type_vendor_model_1.VendorTypeVendor)),
    __param(3, (0, sequelize_1.InjectModel)(project_vendor_model_1.ProjectVendor)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map