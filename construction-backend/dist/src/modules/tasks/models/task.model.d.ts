import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
export declare class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
    id: CreationOptional<string>;
    project_id: string;
    project?: NonAttribute<Project>;
    created_by_user_id: string;
    createdBy?: NonAttribute<User>;
    assigned_to_user_id: CreationOptional<string | null>;
    assignedUser?: NonAttribute<User>;
    title: string;
    module: CreationOptional<string | null>;
    due_date: CreationOptional<string | null>;
    priority: CreationOptional<'low' | 'medium' | 'high' | 'urgent'>;
    task_type: CreationOptional<'General' | 'Design upload' | 'Revision response' | 'Site visit' | 'Vendor follow-up' | 'Inventory dispatch' | 'Quality check' | 'Client response' | 'Internal documentation'>;
    status: CreationOptional<'todo' | 'in_progress' | 'review' | 'completed' | 'blocked'>;
    description: CreationOptional<string | null>;
    created_at: CreationOptional<Date>;
    updated_at: CreationOptional<Date>;
}
