import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Project } from '../../projects/models/project.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Comment extends Model<Comment> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare projectId: string;

  @Column(DataType.STRING(50))
  declare entityType: string;

  @Column(DataType.UUID)
  declare entityId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare parentCommentId: string | null;

  @Column(DataType.TEXT)
  declare comment: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare createdByUserId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isInternal: boolean;

  @BelongsTo(() => User)
  declare author: User;

  @BelongsTo(() => Project)
  declare project: Project;

  @Column(DataType.DATE)
  declare created_at: Date;

  @Column(DataType.DATE)
  declare updated_at: Date;
}
