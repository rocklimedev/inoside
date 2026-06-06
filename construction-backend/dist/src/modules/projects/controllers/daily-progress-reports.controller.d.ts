import { DailyProgressReportsService } from '../services/daily-progress-reports.service';
import { CreateDailyProgressReportDto } from '../dto/create-daily-progress-report.dto';
import { UpdateDailyProgressReportDto } from '../dto/update-daily-progress-report.dto';
export declare class DailyProgressReportsController {
    private readonly service;
    constructor(service: DailyProgressReportsService);
    create(dto: CreateDailyProgressReportDto): Promise<import("../models/daily-progress-report.model").DailyProgressReport>;
    findAll(): Promise<import("../models/daily-progress-report.model").DailyProgressReport[]>;
    findOne(id: string): Promise<import("../models/daily-progress-report.model").DailyProgressReport>;
    update(id: string, dto: UpdateDailyProgressReportDto): Promise<import("../models/daily-progress-report.model").DailyProgressReport>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
