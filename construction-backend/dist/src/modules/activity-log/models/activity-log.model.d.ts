import { Model } from 'sequelize-typescript';
export declare class ActivityLog extends Model<ActivityLog> {
    activityLogId: string;
    userId?: string;
    userName?: string;
    contextTag: string;
    subContext?: string;
    action: string;
    title: string;
    description?: string;
    referenceId?: string;
    referenceType?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    isSystemGenerated: boolean;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    moduleName?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
}
