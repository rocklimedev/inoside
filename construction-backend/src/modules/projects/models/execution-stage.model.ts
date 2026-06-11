import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
  AllowNull,
} from 'sequelize-typescript';

import { Project } from '../../projects/models/project.model';
import { ExecutionActivity } from './execution-activity.model';

@Table({
  tableName: 'execution_stages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false, // Set to true if you want soft delete
})
export class ExecutionStage extends Model<ExecutionStage> {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project: Project;

  // ==================== Ordering ====================
  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  declare order: number;

  // ==================== Basic Info ====================
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare name: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string;

  // ==================== Dates ====================
  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare planned_start_date: Date | null;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare planned_end_date: Date | null;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare actual_start_date: Date | null;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare actual_end_date: Date | null;

  // ==================== Progress & Status ====================
  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare progress_percentage: number;

  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed', 'blocked'),
    allowNull: false,
  })
  declare status: 'pending' | 'in_progress' | 'completed' | 'blocked';

  // ==================== Timestamps ====================
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  // ==================== Relations ====================
  @HasMany(() => ExecutionActivity)
  declare activities: ExecutionActivity[];
}
