import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export interface EstimateItem {
    title: string;
    description: string;
    price?: number | null;
}
export interface PaymentPlanItem {
    title: string;
    description: string;
    amount?: number | null;
}
export declare class ProjectCostEstimate extends Model<InferAttributes<ProjectCostEstimate>, InferCreationAttributes<ProjectCostEstimate>> {
    id: CreationOptional<string>;
    project_id: string;
    estimate_type: 'Consultation' | 'Turnkey' | 'Constructional';
    consultation_fee: number;
    tentative_total_cost: number;
    material_labour_estimate: EstimateItem[];
    payment_plan: PaymentPlanItem[];
    annexure_url: string;
    contract_url: string;
    project?: NonAttribute<Project>;
}
