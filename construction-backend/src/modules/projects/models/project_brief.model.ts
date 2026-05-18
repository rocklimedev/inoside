// ======================================================
// project_brief.model.ts
// ======================================================

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
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'project_brief',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProjectBrief extends Model<
  InferAttributes<ProjectBrief>,
  InferCreationAttributes<ProjectBrief>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  // ======================================================
  // PROJECT
  // ======================================================

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare project_id: string;

  // ======================================================
  // BRIEF DATA
  // ======================================================

  @Column(DataType.JSON)
  declare rooms_spaces_required: any;

  @Column(DataType.BOOLEAN)
  declare parking_required: boolean;

  @Column(DataType.BOOLEAN)
  declare first_construction_project: boolean;

  @Column(DataType.STRING(50))
  declare decision_readiness: string;

  @Column(DataType.BOOLEAN)
  declare end_to_end_services: boolean;

  @Column(DataType.JSON)
  declare output_client_profile: any;

  @Column(DataType.JSON)
  declare output_project_profile: any;

  // ======================================================
  // STATUS
  // ======================================================

  @Default('Pending')
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Pending',
  })
  declare status: CreationOptional<string>;

  // ======================================================
  // APPROVAL
  // ======================================================

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare is_approved: CreationOptional<boolean>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare approved_by: CreationOptional<string | null>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare approved_at: CreationOptional<Date | null>;

  // ======================================================
  // CHANGES REQUESTED
  // ======================================================

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare changes_note: CreationOptional<string | null>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare changes_requested_by: CreationOptional<string | null>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare changes_requested_at: CreationOptional<Date | null>;

  // ======================================================
  // RELATIONS
  // ======================================================

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @BelongsTo(() => User, 'approved_by')
  declare approvedByUser?: NonAttribute<User>;

  @BelongsTo(() => User, 'changes_requested_by')
  declare changesRequestedByUser?: NonAttribute<User>;
}
