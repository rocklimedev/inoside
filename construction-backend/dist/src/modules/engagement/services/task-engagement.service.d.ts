import { EngagementService } from '../engagement.service';
export declare class TaskEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    taskCreated(actor: {
        id: string;
        name: string;
    }, task: {
        id: string;
        title: string;
        projectId?: string | null;
        assignedToUserId?: string | null;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    taskUpdated(actor: {
        id: string;
        name: string;
    }, task: {
        id: string;
        title: string;
    }, oldValues?: Record<string, any>, newValues?: Record<string, any>): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    taskDeleted(actor: {
        id: string;
        name: string;
    }, task: {
        id: string;
        title: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
