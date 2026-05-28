import { RekiReportService } from '../services/reki-report.service';
export declare class RekiController {
    private readonly rekiService;
    constructor(rekiService: RekiReportService);
    getAll(): Promise<import("../models/reki_reports.model").RekiReport[]>;
    getById(id: string): Promise<import("../models/reki_reports.model").RekiReport>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markDone(projectId: string): Promise<import("../models/reki_reports.model").RekiReport>;
    markPending(projectId: string): Promise<import("../models/reki_reports.model").RekiReport>;
    create(projectId: string, dto: any): Promise<import("../models/reki_reports.model").RekiReport>;
    get(projectId: string): Promise<import("../models/reki_reports.model").RekiReport>;
    update(projectId: string, dto: any): Promise<import("../models/reki_reports.model").RekiReport>;
}
