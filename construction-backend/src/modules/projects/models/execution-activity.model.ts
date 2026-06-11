import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Project } from '../../projects/models/project.model';
import { User } from '../../users/models/user.model';
import { ExecutionStage } from './execution-stage.model';

@Table({
  tableName: 'execution_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ExecutionActivity extends Model<ExecutionActivity> {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project: Project;

  @ForeignKey(() => ExecutionStage)
  @Column(DataType.UUID)
  declare stage_id: string;

  @BelongsTo(() => ExecutionStage)
  declare stage: ExecutionStage;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.DATEONLY)
  declare activity_date: Date;

  @Column(DataType.DECIMAL(12, 2))
  declare planned_quantity: number;

  @Column(DataType.DECIMAL(12, 2))
  declare completed_quantity: number;

  @Column(DataType.STRING)
  declare unit: string;

  @Column({
    type: DataType.ENUM('pending', 'ongoing', 'completed', 'delayed'),
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'ongoing' | 'completed' | 'delayed';

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare created_by: string;

  @BelongsTo(() => User)
  declare createdBy: User;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}
