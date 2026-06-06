"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyProgressReportsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const daily_progress_report_model_1 = require("./models/daily-progress-report.model");
const daily_progress_reports_service_1 = require("./services/daily-progress-reports.service");
const daily_progress_reports_controller_1 = require("./controllers/daily-progress-reports.controller");
let DailyProgressReportsModule = class DailyProgressReportsModule {
};
exports.DailyProgressReportsModule = DailyProgressReportsModule;
exports.DailyProgressReportsModule = DailyProgressReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([daily_progress_report_model_1.DailyProgressReport])],
        controllers: [daily_progress_reports_controller_1.DailyProgressReportsController],
        providers: [daily_progress_reports_service_1.DailyProgressReportsService],
        exports: [daily_progress_reports_service_1.DailyProgressReportsService],
    })
], DailyProgressReportsModule);
//# sourceMappingURL=daily-progress-reports.module.js.map