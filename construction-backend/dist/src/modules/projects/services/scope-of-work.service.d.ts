import { ScopeOfWork } from '../models/scope_of_work.model';
import { Project } from '../models/project.model';
export declare class ScopeOfWorkService {
    private scopeModel;
    private projectModel;
    constructor(scopeModel: typeof ScopeOfWork, projectModel: typeof Project);
    private getIncludes;
    create(dto: any): Promise<ScopeOfWork>;
    findByProject(projectId: string): Promise<ScopeOfWork>;
    findById(id: string): Promise<ScopeOfWork>;
    findAll(): Promise<ScopeOfWork[]>;
    update(projectId: string, dto: any): Promise<ScopeOfWork>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markApproved(projectId: string): Promise<ScopeOfWork>;
    markRejected(projectId: string, reason?: string): Promise<{
        scope: ScopeOfWork;
        rejection_reason: string | null;
    }>;
}
