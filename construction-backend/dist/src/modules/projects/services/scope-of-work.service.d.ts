import { ScopeOfWork } from '../models/scope_of_work.model';
import { Project } from '../models/project.model';
export declare class ScopeOfWorkService {
    private scopeModel;
    private projectModel;
    constructor(scopeModel: typeof ScopeOfWork, projectModel: typeof Project);
    create(dto: any): Promise<ScopeOfWork>;
    findOne(project_id: string): Promise<ScopeOfWork>;
    update(project_id: string, dto: any): Promise<ScopeOfWork>;
}
