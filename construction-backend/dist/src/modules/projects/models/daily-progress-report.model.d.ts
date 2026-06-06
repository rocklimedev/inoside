import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';
export declare class DailyProgressReport extends Model {
    id: string;
    project_id: string;
    report_date: string;
    supervisor_id: string | null;
    current_stage: string | null;
    work_executed: string | null;
    manpower_count: number | null;
    materials_used: string | null;
    issues_faced: string | null;
    progress_photos: any;
    created_at: Date;
    project: Project;
    supervisor: User;
}
