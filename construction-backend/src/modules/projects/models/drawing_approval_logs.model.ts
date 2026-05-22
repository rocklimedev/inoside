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
  // RELATIONS
  // ======================================================

  @ForeignKey(() => ProjectDrawing)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare drawing_id: string;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare client_id: CreationOptional<string | null>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare approved_by: CreationOptional<string | null>;

  // ======================================================
  // APPROVAL DETAILS
  // ======================================================

  @Default('commented')
  @Column({
    type: DataType.ENUM(
      'approved',
      'rejected',
      'revision_requested',
      'commented',
    ),
    allowNull: false,
  })
  declare action: 'approved' | 'rejected' | 'revision_requested' | 'commented';

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare approved: CreationOptional<boolean>;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare revision_requested: CreationOptional<boolean>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare remarks: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare internal_note: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare attachment_url: CreationOptional<string | null>;

  // ======================================================
  // VERSION TRACKING
  // ======================================================

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare drawing_version: CreationOptional<number> | null;

  // ======================================================
  // RELATIONS
  // ======================================================

  @BelongsTo(() => ProjectDrawing)
  declare drawing?: NonAttribute<ProjectDrawing>;

  @BelongsTo(() => Client)
  declare client?: NonAttribute<Client>;

  @BelongsTo(() => User, 'approved_by')
  declare approver?: NonAttribute<User>;
}
