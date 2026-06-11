import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Default,
} from 'sequelize-typescript';

import { Project } from '../../projects/models/project.model';
import { User } from '../../users/models/user.model';
import { ExecutionStage } from './execution-stage.model';

@Table({
  tableName: 'execution_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
})
export class ExecutionActivity extends Model<ExecutionActivity> {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project: Project;

  @ForeignKey(() => ExecutionStage)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare stage_id: string;

  @BelongsTo(() => ExecutionStage)
  declare stage: ExecutionStage;

  // ==================== Ordering ====================
  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  declare order: number;

  // ==================== Basic Info ====================
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string;

  // ==================== Dates ====================
  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare activity_date: Date | null;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare planned_start_date: Date | null;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare planned_end_date: Date | null;

  // ==================== Progress & Quantity ====================
  @Default(0)
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare planned_quantity: number;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare completed_quantity: number;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare unit: string;

  // ==================== Status ====================
  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'ongoing', 'completed', 'delayed'),
    allowNull: false,
  })
  declare status: 'pending' | 'ongoing' | 'completed' | 'delayed';

  // ==================== Progress Percentage ====================
  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare progress_percentage: number;

  // ==================== Creator ====================
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare created_by: string;

  @BelongsTo(() => User, 'created_by')
  declare createdBy: User;

  // ==================== Timestamps ====================
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}
