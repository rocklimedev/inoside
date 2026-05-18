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
exports.RekiReportService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const reki_reports_model_1 = require("../models/reki_reports.model");
const project_model_1 = require("../models/project.model");
let RekiReportService = class RekiReportService {
    rekiModel;
    projectModel;
    constructor(rekiModel, projectModel) {
        this.rekiModel = rekiModel;
        this.projectModel = projectModel;
    }
    async create(dto) {
        await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
        const exists = await this.rekiModel.findOne({
            where: { project_id: dto.project_id },
        });
        if (exists)
            throw new common_1.BadRequestException('Reki Report already exists');
        return this.rekiModel.create(dto);
    }
    async findOne(project_id) {
        const reki = await this.rekiModel.findOne({ where: { project_id } });
        if (!reki)
            throw new common_1.NotFoundException('Reki Report not found');
        return reki;
    }
    async update(project_id, dto) {
        await this.findOne(project_id);
        await this.rekiModel.update(dto, { where: { project_id } });
        return this.findOne(project_id);
    }
};
exports.RekiReportService = RekiReportService;
exports.RekiReportService = RekiReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(reki_reports_model_1.RekiReport)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __metadata("design:paramtypes", [Object, Object])
], RekiReportService);
//# sourceMappingURL=reki-report.service.js.map