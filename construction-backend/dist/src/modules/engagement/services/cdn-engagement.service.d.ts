import { EngagementService } from '../engagement.service';
export declare class CdnEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    fileUploaded(actor: {
        id: string;
        name: string;
    }, file: {
        filename: string;
        url: string;
        originalName?: string;
        size?: number;
        mimeType?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    fileViewed(actor: {
        id: string;
        name: string;
    }, file: {
        filename: string;
        url?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    fileUpdated(actor: {
        id: string;
        name: string;
    }, file: {
        filename: string;
    }, oldValues?: Record<string, any>, newValues?: Record<string, any>): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    fileDeleted(actor: {
        id: string;
        name: string;
    }, file: {
        filename: string;
        url?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    uploadFailed(actor: {
        id: string;
        name: string;
    }, filename: string, error: string): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
