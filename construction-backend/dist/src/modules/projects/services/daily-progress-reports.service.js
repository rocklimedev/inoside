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
exports.DailyProgressReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_progress_report_model_1 = require("../models/daily-progress-report.model");
let DailyProgressReportsService = class DailyProgressReportsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const report = this.repo.create({
            ...dto,
        });
        return await this.repo.save(report);
    }
    async findAll() {
        return await this.repo.find({
            relations: {
                project: true,
                supervisor: true,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }
    async findOne(id) {
        const report = await this.repo.findOne({
            where: { id },
            relations: {
                project: true,
                supervisor: true,
            },
        });
        if (!report) {
            throw new common_1.NotFoundException(`Daily progress report not found: ${id}`);
        }
        return report;
    }
    async update(id, dto) {
        const report = await this.findOne(id);
        const { project_id, supervisor_id, ...safeData } = dto;
        Object.assign(report, safeData);
        return await this.repo.save(report);
    }
    async remove(id) {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Report not found: ${id}`);
        }
        return {
            success: true,
            message: 'Report deleted successfully',
        };
    }
};
exports.DailyProgressReportsService = DailyProgressReportsService;
exports.DailyProgressReportsService = DailyProgressReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_progress_report_model_1.DailyProgressReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DailyProgressReportsService);
//# sourceMappingURL=daily-progress-reports.service.js.map