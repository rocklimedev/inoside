import { ScopeOfWorkService } from '../services/scope-of-work.service';
export declare class ScopesController {
    private readonly scopeService;
    constructor(scopeService: ScopeOfWorkService);
    create(projectId: string, dto: any): Promise<import("../models/scope_of_work.model").ScopeOfWork>;
    find(projectId: string): Promise<import("../models/scope_of_work.model").ScopeOfWork>;
    update(projectId: string, dto: any): Promise<import("../models/scope_of_work.model").ScopeOfWork>;
    findAll(): Promise<import("../models/scope_of_work.model").ScopeOfWork[]>;
    findById(scopeId: string): Promise<import("../models/scope_of_work.model").ScopeOfWork>;
    delete(scopeId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markApproved(projectId: string): Promise<import("../models/scope_of_work.model").ScopeOfWork>;
    markRejected(projectId: string, reason?: string): Promise<{
        scope: import("../models/scope_of_work.model").ScopeOfWork;
        rejection_reason: string | null;
    }>;
}
