import { EngagementService } from '../engagement.service';
export declare class UserEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    userCreated(actor: {
        id: string;
        name: string;
    }, user: {
        id: string;
        name: string;
        email: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    userUpdated(actor: {
        id: string;
        name: string;
    }, user: {
        id: string;
        name: string;
    }, oldValues?: Record<string, any>, newValues?: Record<string, any>): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    userDeleted(actor: {
        id: string;
        name: string;
    }, user: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    userStatusChanged(actor: {
        id: string;
        name: string;
    }, user: {
        id: string;
        name: string;
        isActive: boolean;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
