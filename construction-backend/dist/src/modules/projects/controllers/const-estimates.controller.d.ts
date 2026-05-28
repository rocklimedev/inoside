import { ProjectCostEstimateService } from '../services/project-cost-estimate.service';
export declare class CostEstimatesController {
    private readonly costService;
    constructor(costService: ProjectCostEstimateService);
    addEstimate(projectId: string, dto: any): Promise<import("../models/project_cost_estimates.model").ProjectCostEstimate>;
    getEstimates(projectId: string): Promise<import("../models/project_cost_estimates.model").ProjectCostEstimate[]>;
    updateEstimate(estimateId: string, dto: any): Promise<import("../models/project_cost_estimates.model").ProjectCostEstimate>;
    deleteEstimate(estimateId: string): Promise<number>;
}
