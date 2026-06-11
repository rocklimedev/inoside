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
    order: number;
    title: string;
    description: string;
    activity_date: Date | null;
    planned_start_date: Date | null;
    planned_end_date: Date | null;
    planned_quantity: number;
    completed_quantity: number;
    unit: string;
    status: 'pending' | 'ongoing' | 'completed' | 'delayed';
    progress_percentage: number;
    created_by: string;
    createdBy: User;
    readonly created_at: Date;
    readonly updated_at: Date;
}
