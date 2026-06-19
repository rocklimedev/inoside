import { EngagementService } from '../engagement.service';
export declare class SiteEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    siteCreated(actor: {
        id: string;
        name: string;
    }, site: {
        id: string;
        clientId?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    siteUpdated(actor: {
        id: string;
        name: string;
    }, site: {
        id: string;
        clientId?: string;
    }, oldValues?: Record<string, any>, newValues?: Record<string, any>): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    siteDeleted(actor: {
        id: string;
        name: string;
    }, site: {
        id: string;
        clientId?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
