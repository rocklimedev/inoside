import { Model } from 'sequelize-typescript';
import { Project } from '../../projects/models/project.model';
import { ExecutionActivity } from './execution-activity.model';
export declare class ExecutionStage extends Model<ExecutionStage> {
    id: string;
    project_id: string;
    project: Project;
    order: number;
    name: string;
    description: string;
    planned_start_date: Date | null;
    planned_end_date: Date | null;
    actual_start_date: Date | null;
    actual_end_date: Date | null;
    progress_percentage: number;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    readonly created_at: Date;
    readonly updated_at: Date;
    activities: ExecutionActivity[];
}
