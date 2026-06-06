export declare class CreateActivityLogDto {
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
    isSystemGenerated?: boolean;
    severity?: string;
    moduleName?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
}
