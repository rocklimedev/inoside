import { EngagementService } from '../engagement.service';
export declare class ClientEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    clientCreated(actor: {
        id: string;
        name: string;
    }, client: {
        id: string;
        name: string;
        email?: string;
        company_name?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    clientViewed(actor: {
        id: string;
        name: string;
    }, client: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    clientUpdated(actor: {
        id: string;
        name: string;
    }, client: {
        id: string;
        name: string;
    }, oldValues?: Record<string, any>, newValues?: Record<string, any>): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    clientDeleted(actor: {
        id: string;
        name: string;
    }, client: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    duplicateEmailAttempt(actor: {
        id: string;
        name: string;
    }, email: string): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
