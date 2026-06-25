// team_tasks.model.ts

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
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { ExecutionStage } from '@/modules/projects/models/execution-stage.model';
import { ExecutionActivity } from '@/modules/projects/models/execution-activity.model';
import { ExecutionDrawingSet } from '@/modules/projects/models/execution_drawing_set.model';
import { ExecutionDrawingVersion } from '@/modules/projects/models/execution_drawing_version.model';
import { ProjectStage } from '@/modules/projects/models/project_stage.model';

@Table({
  tableName: 'team_tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class TeamTask extends Model<
  InferAttributes<TeamTask>,
  InferCreationAttributes<TeamTask>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  declare project_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare created_by_user_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare assigned_to_user_id: CreationOptional<string | null>;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING(255) })
  declare module: CreationOptional<string | null>;

  // === Execution Related Fields ===
  @ForeignKey(() => ExecutionStage)
  @Column({ type: DataType.UUID, allowNull: true })
  declare execution_stage_id: CreationOptional<string | null>;

  @ForeignKey(() => ExecutionActivity)
  @Column({ type: DataType.UUID, allowNull: true })
  declare execution_activity_id: CreationOptional<string | null>;

  @ForeignKey(() => ExecutionDrawingSet)
  @Column({ type: DataType.UUID, allowNull: true })
  declare execution_drawing_set_id: CreationOptional<string | null>;

  @ForeignKey(() => ExecutionDrawingVersion)
  @Column({ type: DataType.UUID, allowNull: true })
  declare execution_drawing_version_id: CreationOptional<string | null>;

  @ForeignKey(() => ProjectStage)
  @Column({ type: DataType.UUID, allowNull: true })
  declare project_stage_id: CreationOptional<string | null>;

  @Column({ type: DataType.DATEONLY })
  declare due_date: CreationOptional<Date | null>;

  @Default('medium')
  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
  })
  declare priority: 'low' | 'medium' | 'high' | 'urgent';

  @Default('General')
  @Column({
    type: DataType.ENUM(
      'General',
      'Design upload',
      'Revision response',
      'Site visit',
      'Vendor follow-up',
      'Inventory dispatch',
      'Quality check',
      'Client response',
      'Internal documentation',
      'Execution Drawing Upload',
      'Execution Drawing Revision',
    ),
    allowNull: false,
  })
  declare task_type:
    | 'General'
    | 'Design upload'
    | 'Revision response'
    | 'Site visit'
    | 'Vendor follow-up'
    | 'Inventory dispatch'
    | 'Quality check'
    | 'Client response'
    | 'Internal documentation'
    | 'Execution Drawing Upload'
    | 'Execution Drawing Revision';

  @Default('todo')
  @Column({
    type: DataType.ENUM(
      'todo',
      'in_progress',
      'review',
      'completed',
      'blocked',
    ),
    allowNull: false,
  })
  declare status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';

  @Column({ type: DataType.TEXT })
  declare description: CreationOptional<string | null>;

  // ======================================================
  // RELATIONS
  // ======================================================

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @BelongsTo(() => User, 'created_by_user_id')
  declare createdBy?: NonAttribute<User>;

  @BelongsTo(() => User, 'assigned_to_user_id')
  declare assignedTo?: NonAttribute<User>;

  @BelongsTo(() => ExecutionStage)
  declare executionStage?: NonAttribute<ExecutionStage>;

  @BelongsTo(() => ExecutionActivity)
  declare executionActivity?: NonAttribute<ExecutionActivity>;

  @BelongsTo(() => ExecutionDrawingSet)
  declare executionDrawingSet?: NonAttribute<ExecutionDrawingSet>;

  @BelongsTo(() => ExecutionDrawingVersion)
  declare executionDrawingVersion?: NonAttribute<ExecutionDrawingVersion>;

  @BelongsTo(() => ProjectStage)
  declare projectStage?: NonAttribute<ProjectStage>;
}
