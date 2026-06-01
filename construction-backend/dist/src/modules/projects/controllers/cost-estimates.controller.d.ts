import { ProjectCostEstimateService } from '../services/project-cost-estimate.service';
interface EstimateItem {
    title: string;
    description: string;
}
interface PaymentPlanItem {
    title: string;
    description: string;
}
interface CreateCostEstimateDto {
    estimate_type: 'Consultation' | 'Turnkey' | 'Constructional';
    consultation_fee?: number;
    tentative_total_cost?: number;
    material_labour_estimate?: EstimateItem[];
    payment_plan?: PaymentPlanItem[];
    annexure_url?: string;
    contract_url?: string;
}
export declare class CostEstimatesController {
    private readonly costService;
    constructor(costService: ProjectCostEstimateService);
    findAll(): Promise<import("../models/project_cost_estimates.model").ProjectCostEstimate[]>;
    addEstimate(projectId: string, dto: CreateCostEstimateDto): Promise<import("../models/project_cost_estimates.model").ProjectCostEstimate>;
    getEstimates(projectId: string): Promise<import("../models/project_cost_estimates.model").ProjectCostEstimate[]>;
    updateEstimate(estimateId: string, dto: Partial<CreateCostEstimateDto>): Promise<import("../models/project_cost_estimates.model").ProjectCostEstimate>;
    deleteEstimate(estimateId: string): Promise<number>;
    private validate;
}
export {};
