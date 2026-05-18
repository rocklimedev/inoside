import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from './project.model';
import { User } from '../../users/models/user.model';
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
    status: CreationOptional<string>;
    is_approved: CreationOptional<boolean>;
    approved_by: CreationOptional<string | null>;
    approved_at: CreationOptional<Date | null>;
    changes_note: CreationOptional<string | null>;
    changes_requested_by: CreationOptional<string | null>;
    changes_requested_at: CreationOptional<Date | null>;
    project?: NonAttribute<Project>;
    approvedByUser?: NonAttribute<User>;
    changesRequestedByUser?: NonAttribute<User>;
}
