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
    delete(activityLogId: string): Promise<number>;
}
