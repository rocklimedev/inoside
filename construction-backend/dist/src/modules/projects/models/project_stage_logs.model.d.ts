import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from './project.model';
import { ProjectStage } from './project_stage.model';
import { User } from '@/modules/users/models/user.model';
export declare class ProjectStageLog extends Model<InferAttributes<ProjectStageLog>, InferCreationAttributes<ProjectStageLog>> {
    id: CreationOptional<string>;
    project_id: string;
    project?: NonAttribute<Project>;
    stage_id: string;
    stage?: NonAttribute<ProjectStage>;
    actor_id: CreationOptional<string | null>;
    actor?: NonAttribute<User>;
    action: 'created' | 'started' | 'updated' | 'completed' | 'blocked' | 'reopened' | 'commented' | 'assigned' | 'entity_linked' | 'entity_updated';
    message: CreationOptional<string | null>;
    meta: CreationOptional<{
        before?: any;
        after?: any;
        changed_fields?: string[];
        note?: string;
    } | null>;
}
