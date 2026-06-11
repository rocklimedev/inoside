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

@Table({
  tableName: 'execution_stages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ExecutionStage extends Model<ExecutionStage> {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project: Project;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column(DataType.DATEONLY)
  declare planned_start_date: Date;

  @Column(DataType.DATEONLY)
  declare planned_end_date: Date;

  @Column(DataType.DATEONLY)
  declare actual_start_date: Date;

  @Column(DataType.DATEONLY)
  declare actual_end_date: Date;

  @Column({
    type: DataType.DECIMAL(5, 2),
    defaultValue: 0,
  })
  declare progress_percentage: number;

  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed', 'blocked'),
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'in_progress' | 'completed' | 'blocked';

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}
