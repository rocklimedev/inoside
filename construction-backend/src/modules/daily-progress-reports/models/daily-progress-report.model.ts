import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  CreatedAt,
} from 'sequelize-typescript';

import type { CreationOptional, NonAttribute } from 'sequelize';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { ExecutionStage } from '@/modules/execution/models/execution-stage.model';
@Table({
  tableName: 'daily_progress_reports',
  timestamps: false,
})
export class DailyProgressReport extends Model {
  // ======================================================
  // PRIMARY KEY
  // ======================================================

  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  // ======================================================
  // FOREIGN KEYS
  // ======================================================

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare project_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare supervisor_id: CreationOptional<string | null>;

  @ForeignKey(() => ExecutionStage)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare execution_stage_id: CreationOptional<string | null>;

  // ======================================================
  // REPORT DETAILS
  // ======================================================

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare report_date: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare current_stage: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare work_executed: CreationOptional<string | null>;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare manpower_count: CreationOptional<number | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare materials_used: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare issues_faced: CreationOptional<string | null>;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare progress_photos: CreationOptional<any>;

  // ======================================================
  // TIMESTAMPS
  // ======================================================

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare created_at: CreationOptional<Date>;

  // ======================================================
  // RELATIONS
  // ======================================================

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @BelongsTo(() => User, 'supervisor_id')
  declare supervisor?: NonAttribute<User>;

  @BelongsTo(() => ExecutionStage, 'execution_stage_id')
  declare executionStage?: NonAttribute<ExecutionStage>;
}
