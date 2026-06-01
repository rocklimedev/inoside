import { ProjectCostEstimate } from '../models/project_cost_estimates.model';
import { Project } from '../models/project.model';
export declare class ProjectCostEstimateService {
    private costModel;
    private projectModel;
    constructor(costModel: typeof ProjectCostEstimate, projectModel: typeof Project);
    findAll(): Promise<ProjectCostEstimate[]>;
    add(dto: any): Promise<ProjectCostEstimate>;
    findByProject(project_id: string): Promise<ProjectCostEstimate[]>;
    update(id: string, dto: any): Promise<ProjectCostEstimate>;
    delete(id: string): Promise<number>;
    private validateDto;
}
