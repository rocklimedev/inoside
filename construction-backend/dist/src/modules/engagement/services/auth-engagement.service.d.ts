import { EngagementService } from '../engagement.service';
export declare class AuthEngagementService {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    userRegistered(user: {
        id: string;
        name: string;
        email: string;
        role?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    loginSuccess(user: {
        id: string;
        name: string;
        email: string;
        role?: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    loginFailed(email: string): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    loginBlocked(user: {
        id: string;
        name: string;
        email: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    logout(user: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
    passwordReset(user: {
        id: string;
        name: string;
    }): Promise<import("../../activity-log/models/activity-log.model").ActivityLog>;
}
