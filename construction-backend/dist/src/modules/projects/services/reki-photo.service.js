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
exports.RekiPhotoService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const reki_photos_model_1 = require("../models/reki_photos.model");
const project_model_1 = require("../models/project.model");
const reki_reports_model_1 = require("../models/reki_reports.model");
let RekiPhotoService = class RekiPhotoService {
    rekiPhotoModel;
    projectModel;
    rekiModel;
    constructor(rekiPhotoModel, projectModel, rekiModel) {
        this.rekiPhotoModel = rekiPhotoModel;
        this.projectModel = projectModel;
        this.rekiModel = rekiModel;
    }
    getIncludes() {
        return [
            {
                model: project_model_1.Project,
                attributes: ['id', 'name', 'status', 'progress_percentage'],
            },
            {
                model: reki_reports_model_1.RekiReport,
                attributes: ['id', 'project_id'],
            },
        ];
    }
    async add(dto) {
        const project = await this.projectModel.findByPk(dto.project_id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (dto.reki_report_id) {
            const reki = await this.rekiModel.findByPk(dto.reki_report_id);
            if (!reki) {
                throw new common_1.NotFoundException('Reki Report not found');
            }
        }
        if (!dto.image_url) {
            throw new common_1.BadRequestException('image_url is required');
        }
        return this.rekiPhotoModel.create(dto);
    }
    async findById(id) {
        const photo = await this.rekiPhotoModel.findByPk(id, {
            include: this.getIncludes(),
        });
        if (!photo) {
            throw new common_1.NotFoundException('Reki photo not found');
        }
        return photo;
    }
    async findByReki(rekiReportId) {
        return this.rekiPhotoModel.findAll({
            where: {
                reki_report_id: rekiReportId,
            },
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async update(id, dto) {
        const photo = await this.rekiPhotoModel.findByPk(id);
        if (!photo) {
            throw new common_1.NotFoundException('Reki photo not found');
        }
        await photo.update(dto);
        return this.findById(id);
    }
    async delete(id) {
        const photo = await this.rekiPhotoModel.findByPk(id);
        if (!photo) {
            throw new common_1.NotFoundException('Reki photo not found');
        }
        await photo.destroy();
        return {
            success: true,
            message: 'Reki photo deleted successfully',
        };
    }
    async bulkDelete(ids) {
        await this.rekiPhotoModel.destroy({
            where: {
                id: ids,
            },
        });
        return {
            success: true,
            message: 'Photos deleted successfully',
        };
    }
};
exports.RekiPhotoService = RekiPhotoService;
exports.RekiPhotoService = RekiPhotoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(reki_photos_model_1.RekiPhoto)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __param(2, (0, sequelize_1.InjectModel)(reki_reports_model_1.RekiReport)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RekiPhotoService);
//# sourceMappingURL=reki-photo.service.js.map