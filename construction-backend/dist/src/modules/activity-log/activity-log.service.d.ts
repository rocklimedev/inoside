import { ActivityLog } from './models/activity-log.model';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
export declare class ActivityLogService {
    private readonly activityLogModel;
    constructor(activityLogModel: typeof ActivityLog);
    create(payload: CreateActivityLogDto): Promise<ActivityLog>;
    bulkCreate(payloads: CreateActivityLogDto[]): Promise<ActivityLog[]>;
    getLogs(page?: number, limit?: number): Promise<{
        count: number;
        rows: ActivityLog[];
    }>;
    findById(activityLogId: string): Promise<ActivityLog | null>;
    findByUserId(userId: string, page?: number, limit?: number): Promise<{
        rows: ActivityLog[];
        count: number;
    }>;
    findByReference(referenceId: string, referenceType?: string): Promise<ActivityLog[]>;
    findByModule(moduleName: string, page?: number, limit?: number): Promise<{
        rows: ActivityLog[];
        count: number;
    }>;
    findByContextTag(contextTag: string, page?: number, limit?: number): Promise<{
        rows: ActivityLog[];
        count: number;
    }>;
    findBySeverity(severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL', page?: number, limit?: number): Promise<{
        rows: ActivityLog[];
        count: number;
    }>;
    search(filters: {
        userId?: string;
        moduleName?: string;
        contextTag?: string;
        action?: string;
        severity?: string;
        referenceId?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        rows: ActivityLog[];
        count: number;
    }>;
    getRecent(limit?: number): Promise<ActivityLog[]>;
    getStats(): Promise<{
        totalLogs: number;
        info: number;
        warning: number;
        error: number;
        critical: number;
    }>;
    delete(activityLogId: string): Promise<number>;
    deleteOlderThan(days: number): Promise<number>;
}
