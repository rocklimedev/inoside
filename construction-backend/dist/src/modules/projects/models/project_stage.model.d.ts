import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';
import { ProjectStageLog } from './project_stage_logs.model';
export declare class ProjectStage extends Model<InferAttributes<ProjectStage>, InferCreationAttributes<ProjectStage>> {
    id: CreationOptional<string>;
    project_id: string;
    project?: NonAttribute<Project>;
    stage_key: 'brief' | 'pitch' | 'reki' | 'scope' | 'cost_estimate' | 'drawings' | 'execution' | 'handover';
    stage_name: CreationOptional<string | null>;
    sequence: number;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
    entity_type: 'ProjectBrief' | 'ProjectPitch' | 'RekiReport' | 'ScopeOfWork' | 'ProjectCostEstimate' | 'ProjectDrawing' | null;
    entity_id: CreationOptional<string | null>;
    started_at: CreationOptional<Date | null>;
    completed_at: CreationOptional<Date | null>;
    assigned_to: CreationOptional<string | null>;
    assignee?: NonAttribute<User>;
    logs?: NonAttribute<ProjectStageLog[]>;
}
