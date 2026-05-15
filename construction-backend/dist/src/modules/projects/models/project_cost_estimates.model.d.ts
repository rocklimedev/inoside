import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class ProjectCostEstimate extends Model<InferAttributes<ProjectCostEstimate>, InferCreationAttributes<ProjectCostEstimate>> {
    id: CreationOptional<string>;
    project_id: string;
    estimate_type: 'Consultation' | 'Turnkey' | 'Constructional';
    consultation_fee: number;
    tentative_total_cost: number;
    material_labour_estimate: any;
    payment_plan: any;
    annexure_url: string;
    contract_url: string;
    project?: NonAttribute<Project>;
}
