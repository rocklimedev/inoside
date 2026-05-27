import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';
import { DrawingApprovalLog } from './drawing_approval_logs.model';
export declare class ProjectDrawing extends Model<InferAttributes<ProjectDrawing>, InferCreationAttributes<ProjectDrawing>> {
    id: CreationOptional<string>;
    project_id: string;
    uploaded_by: string;
    approved_by: string;
    drawing_type: 'Design' | 'Execution' | 'Technical' | 'Construction' | 'Working';
    version: number;
    area_floor: string;
    file_url: string;
    approved: boolean;
    approval_date: Date;
    project?: NonAttribute<Project>;
    uploadedBy?: NonAttribute<User>;
    approvedBy?: NonAttribute<User>;
    approvalLogs?: NonAttribute<DrawingApprovalLog[]>;
}
