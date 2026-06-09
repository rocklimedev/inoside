import { ActivityLogService } from './activity-log.service';
export declare class ActivityLogController {
    private readonly activityLogService;
    constructor(activityLogService: ActivityLogService);
    getLogs(page?: number, limit?: number): Promise<{
        count: number;
        rows: import("./models/activity-log.model").ActivityLog[];
    }>;
    getStats(): Promise<{
        totalLogs: number;
        info: number;
        warning: number;
        error: number;
        critical: number;
    }>;
    getRecent(limit?: number): Promise<import("./models/activity-log.model").ActivityLog[]>;
    search(userId?: string, moduleName?: string, contextTag?: string, action?: string, severity?: string, referenceId?: string, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<{
        rows: import("./models/activity-log.model").ActivityLog[];
        count: number;
    }>;
    getById(activityLogId: string): Promise<import("./models/activity-log.model").ActivityLog | null>;
    getByUser(userId: string, page?: number, limit?: number): Promise<{
        rows: import("./models/activity-log.model").ActivityLog[];
        count: number;
    }>;
    getByModule(moduleName: string, page?: number, limit?: number): Promise<{
        rows: import("./models/activity-log.model").ActivityLog[];
        count: number;
    }>;
    getBySeverity(severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL', page?: number, limit?: number): Promise<{
        rows: import("./models/activity-log.model").ActivityLog[];
        count: number;
    }>;
    delete(activityLogId: string): Promise<number>;
}
