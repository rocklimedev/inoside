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
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { DrawingApprovalLog } from './drawing_approval_logs.model';

@Table({
  tableName: 'project_drawings',
  timestamps: true,
  createdAt: 'uploaded_at',
  updatedAt: false,
})
export class ProjectDrawing extends Model<
  InferAttributes<ProjectDrawing>,
  InferCreationAttributes<ProjectDrawing>
> {
  // ======================================================
  // PRIMARY KEY
  // ======================================================

  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  // ======================================================
  // FOREIGN KEYS
  // ======================================================

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare uploaded_by: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare approved_by: string;

  // ======================================================
  // BASIC FIELDS
  // ======================================================

  @Column(
    DataType.ENUM(
      'Design',
      'Execution',
      'Technical',
      'Construction',
      'Working',
    ),
  )
  declare drawing_type:
    | 'Design'
    | 'Execution'
    | 'Technical'
    | 'Construction'
    | 'Working';

  @Column(DataType.INTEGER)
  declare version: number;

  @Column(DataType.STRING)
  declare area_floor: string;

  @Column(DataType.STRING)
  declare file_url: string;

  @Column(DataType.BOOLEAN)
  declare approved: boolean;

  @Column(DataType.DATE)
  declare approval_date: Date;

  // ======================================================
  // RELATIONS
  // ======================================================

  @BelongsTo(() => Project, {
    foreignKey: 'project_id',
    as: 'project',
  })
  declare project?: NonAttribute<Project>;

  // 👇 IMPORTANT: alias required (fixes your error)

  @BelongsTo(() => User, {
    foreignKey: 'uploaded_by',
    as: 'uploadedBy',
  })
  declare uploadedBy?: NonAttribute<User>;

  @BelongsTo(() => User, {
    foreignKey: 'approved_by',
    as: 'approvedBy',
  })
  declare approvedBy?: NonAttribute<User>;

  @HasMany(() => DrawingApprovalLog, {
    foreignKey: 'drawing_id',
    as: 'approvalLogs',
  })
  declare approvalLogs?: NonAttribute<DrawingApprovalLog[]>;
}
