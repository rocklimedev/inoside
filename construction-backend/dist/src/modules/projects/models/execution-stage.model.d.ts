import { Model } from 'sequelize-typescript';
import { Project } from '../../projects/models/project.model';
export declare class ExecutionStage extends Model<ExecutionStage> {
    id: string;
    project_id: string;
    project: Project;
    name: string;
    description: string;
    planned_start_date: Date;
    planned_end_date: Date;
    actual_start_date: Date;
    actual_end_date: Date;
    progress_percentage: number;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    readonly created_at: Date;
    readonly updated_at: Date;
}
