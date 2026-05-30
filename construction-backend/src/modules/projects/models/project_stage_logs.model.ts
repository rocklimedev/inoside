// project_stage_logs.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Project } from './project.model';
import { ProjectStage } from './project_stage.model';
import { User } from '@/modules/users/models/user.model';

@Table({
  tableName: 'project_stage_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class ProjectStageLog extends Model<
  InferAttributes<ProjectStageLog>,
  InferCreationAttributes<ProjectStageLog>
> {
  // ======================================================
  // PRIMARY KEY
  // ======================================================
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  // ======================================================
  // RELATIONS
  // ======================================================
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @ForeignKey(() => ProjectStage)
  @Column({ type: DataType.UUID, allowNull: false })
  declare stage_id: string;

  @BelongsTo(() => ProjectStage)
  declare stage?: NonAttribute<ProjectStage>;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare actor_id: CreationOptional<string | null>;

  @BelongsTo(() => User)
  declare actor?: NonAttribute<User>;

  // ======================================================
  // EVENT TYPE
  // ======================================================
  @Column({
    type: DataType.ENUM(
      'created',
      'started',
      'updated',
      'completed',
      'blocked',
      'reopened',
      'commented',
      'assigned',
      'entity_linked',
      'entity_updated',
    ),
    allowNull: false,
  })
  declare action:
    | 'created'
    | 'started'
    | 'updated'
    | 'completed'
    | 'blocked'
    | 'reopened'
    | 'commented'
    | 'assigned'
    | 'entity_linked'
    | 'entity_updated';

  // ======================================================
  // HUMAN MESSAGE
  // ======================================================
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare message: CreationOptional<string | null>;

  // ======================================================
  // CHANGE TRACKING / DEBUGGING
  // ======================================================
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare meta: CreationOptional<{
    before?: any;
    after?: any;
    changed_fields?: string[];
    note?: string;
  } | null>;
}
