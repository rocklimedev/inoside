// project_stage.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  HasMany,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';
import { ProjectStageLog } from './project_stage_logs.model';

@Table({
  tableName: 'project_stages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProjectStage extends Model<
  InferAttributes<ProjectStage>,
  InferCreationAttributes<ProjectStage>
> {
  // ======================================================
  // PRIMARY KEY
  // ======================================================
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  // ======================================================
  // PROJECT RELATION
  // ======================================================
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  // ======================================================
  // STAGE DEFINITION (SYSTEM KEY)
  // ======================================================
  @Column({
    type: DataType.ENUM(
      'brief',
      'pitch',
      'reki',
      'scope',
      'cost_estimate',
      'drawings',
      'execution',
      'handover',
    ),
    allowNull: false,
  })
  declare stage_key:
    | 'brief'
    | 'pitch'
    | 'reki'
    | 'scope'
    | 'cost_estimate'
    | 'drawings'
    | 'execution'
    | 'handover';

  // Human readable label (optional override)
  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare stage_name: CreationOptional<string | null>;

  // ======================================================
  // ORDER IN WORKFLOW
  // ======================================================
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare sequence: number;

  // ======================================================
  // STATUS
  // ======================================================
  @Default('pending')
  @Column({
    type: DataType.ENUM(
      'pending',
      'in_progress',
      'completed',
      'blocked',
      'skipped',
    ),
    allowNull: false,
  })
  declare status:
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'blocked'
    | 'skipped';

  // ======================================================
  // LINK TO ACTUAL DOMAIN MODEL (IMPORTANT PART)
  // ======================================================

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare entity_type:
    | 'ProjectBrief'
    | 'ProjectPitch'
    | 'RekiReport'
    | 'ScopeOfWork'
    | 'ProjectCostEstimate'
    | 'ProjectDrawing'
    | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare entity_id: CreationOptional<string | null>;

  // ======================================================
  // TIMELINE
  // ======================================================
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare started_at: CreationOptional<Date | null>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare completed_at: CreationOptional<Date | null>;

  // ======================================================
  // ASSIGNEE
  // ======================================================
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare assigned_to: CreationOptional<string | null>;

  @BelongsTo(() => User)
  declare assignee?: NonAttribute<User>;

  // ======================================================
  // LOGS
  // ======================================================
  @HasMany(() => ProjectStageLog)
  declare logs?: NonAttribute<ProjectStageLog[]>;
}
