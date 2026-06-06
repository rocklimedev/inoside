import { Repository } from 'typeorm';
import { DailyProgressReport } from '../models/daily-progress-report.model';
import { CreateDailyProgressReportDto } from '../dto/create-daily-progress-report.dto';
import { UpdateDailyProgressReportDto } from '../dto/update-daily-progress-report.dto';
export declare class DailyProgressReportsService {
    private readonly repo;
    constructor(repo: Repository<DailyProgressReport>);
    create(dto: CreateDailyProgressReportDto): Promise<DailyProgressReport>;
    findAll(): Promise<DailyProgressReport[]>;
    findOne(id: string): Promise<DailyProgressReport>;
    update(id: string, dto: UpdateDailyProgressReportDto): Promise<DailyProgressReport>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
