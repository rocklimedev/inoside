// drawing_approval_logs.model.ts

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

import { ProjectDrawing } from './project-drawings.model';
import { Client } from '@/modules/clients/models/client.model';
import { User } from '@/modules/users/models/user.model';

@Table({
  tableName: 'drawing_approval_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class DrawingApprovalLog extends Model<
  InferAttributes<DrawingApprovalLog>,
  InferCreationAttributes<DrawingApprovalLog>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => ProjectDrawing)
  @Column({ type: DataType.UUID, allowNull: false })
  declare drawing_id: string;

  @ForeignKey(() => Client)
  @Column({ type: DataType.UUID, allowNull: true })
  declare client_id: CreationOptional<string | null>;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare approved_by: CreationOptional<string | null>;

  @Column({
    type: DataType.ENUM(
      'approved',
      'rejected',
      'revision_requested',
      'commented',
    ),
    allowNull: false,
    defaultValue: 'commented',
  })
  declare action: 'approved' | 'rejected' | 'revision_requested' | 'commented';

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare approved: CreationOptional<boolean>;

  @Column({ type: DataType.TEXT })
  declare remarks: CreationOptional<string | null>;

  @Column({ type: DataType.TEXT })
  declare internal_note: CreationOptional<string | null>;

  @Column({ type: DataType.STRING(500) })
  declare attachment_url: CreationOptional<string | null>;

  @Column({ type: DataType.INTEGER })
  declare drawing_version: CreationOptional<number | null>;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare revision_requested: CreationOptional<boolean>;

  // ======================================================
  // RELATIONS
  // ======================================================

  @BelongsTo(() => ProjectDrawing)
  declare drawing?: NonAttribute<ProjectDrawing>;

  @BelongsTo(() => Client)
  declare client?: NonAttribute<Client>;

  @BelongsTo(() => User)
  declare approver?: NonAttribute<User>;
}
