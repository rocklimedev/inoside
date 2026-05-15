import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { ProjectDrawing } from './project-drawings.model';
import { Client } from '@/modules/clients/models/client.model';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
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
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => ProjectDrawing)
  @Column(DataType.UUID)
  declare drawing_id: string;

  @ForeignKey(() => Client)
  @Column(DataType.UUID)
  declare client_id: string;

  @Column(DataType.BOOLEAN)
  declare approved: boolean;

  @Column(DataType.TEXT)
  declare remarks: string;

  @Column(DataType.BOOLEAN)
  declare revision_requested: boolean;

  @BelongsTo(() => ProjectDrawing)
  declare drawing?: NonAttribute<ProjectDrawing>;
}
