import { EngagementService } from '../engagement.service';
export declare class VendorEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    vendorCreated(actor: {
        id: string;
        name: string;
    }, vendor: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    vendorUpdated(actor: {
        id: string;
        name: string;
    }, vendor: {
        id: string;
        name: string;
    }, oldValues?: Record<string, any>, newValues?: Record<string, any>): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    vendorDeleted(actor: {
        id: string;
        name: string;
    }, vendor: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    vendorAssignedToProject(actor: {
        id: string;
        name: string;
    }, projectId: string, vendorId: string): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    vendorRemovedFromProject(actor: {
        id: string;
        name: string;
    }, projectId: string, vendorId: string): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
