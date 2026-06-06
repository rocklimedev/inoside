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

import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';

@Table({
  tableName: 'daily_progress_reports',
  timestamps: false,
})
export class DailyProgressReport extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @Column(DataType.DATEONLY)
  declare report_date: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare supervisor_id: string | null;

  @Column(DataType.STRING(100))
  declare current_stage: string | null;

  @Column(DataType.TEXT)
  declare work_executed: string | null;

  @Column(DataType.INTEGER)
  declare manpower_count: number | null;

  @Column(DataType.TEXT)
  declare materials_used: string | null;

  @Column(DataType.TEXT)
  declare issues_faced: string | null;

  @Column(DataType.JSON)
  declare progress_photos: any;

  @CreatedAt
  @Column(DataType.DATE)
  declare created_at: Date;

  @BelongsTo(() => Project)
  declare project: Project;

  @BelongsTo(() => User)
  declare supervisor: User;
}
