import { EngagementService } from '../engagement.service';
export declare class RbacEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    roleCreated(actor: {
        id: string;
        name: string;
    }, role: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    permissionCreated(actor: {
        id: string;
        name: string;
    }, permission: {
        id: string;
        name: string;
        module?: string;
        action?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    permissionsAssigned(actor: {
        id: string;
        name: string;
    }, role: {
        id: string;
        name: string;
    }, permissionIds: string[]): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
