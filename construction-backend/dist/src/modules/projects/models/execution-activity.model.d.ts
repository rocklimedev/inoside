import { Model } from 'sequelize-typescript';
import { Project } from '../../projects/models/project.model';
import { User } from '../../users/models/user.model';
import { ExecutionStage } from './execution-stage.model';
export declare class ExecutionActivity extends Model<ExecutionActivity> {
    id: string;
    project_id: string;
    project: Project;
    stage_id: string;
    stage: ExecutionStage;
    title: string;
    description: string;
    activity_date: Date;
    planned_quantity: number;
    completed_quantity: number;
    unit: string;
    status: 'pending' | 'ongoing' | 'completed' | 'delayed';
    created_by: string;
    createdBy: User;
    readonly created_at: Date;
    readonly updated_at: Date;
}
