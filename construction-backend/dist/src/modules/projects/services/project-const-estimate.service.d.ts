import { ProjectCostEstimate } from './models/project_cost_estimates.model';
import { Project } from './models/project.model';
export declare class ProjectCostEstimateService {
    private costModel;
    private projectModel;
    constructor(costModel: typeof ProjectCostEstimate, projectModel: typeof Project);
    add(dto: any): Promise<any>;
    findByProject(project_id: string): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    delete(id: string): Promise<any>;
}
