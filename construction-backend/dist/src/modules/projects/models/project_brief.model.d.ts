import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class ProjectBrief extends Model<InferAttributes<ProjectBrief>, InferCreationAttributes<ProjectBrief>> {
    id: CreationOptional<string>;
    project_id: string;
    rooms_spaces_required: any;
    parking_required: boolean;
    first_construction_project: boolean;
    decision_readiness: string;
    end_to_end_services: boolean;
    output_client_profile: any;
    output_project_profile: any;
    project?: NonAttribute<Project>;
}
