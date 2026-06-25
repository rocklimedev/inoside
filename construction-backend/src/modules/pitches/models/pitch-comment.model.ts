// ======================================================
// 📁 pitch_comment.model.ts
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

import { ProjectPitch } from './project_pitch.model';
import { User } from '@/modules/users/models/user.model';

@Table({
  tableName: 'pitch_comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class PitchComment extends Model<
  InferAttributes<PitchComment>,
  InferCreationAttributes<PitchComment>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  // ======================================================
  // RELATIONS
  // ======================================================

  @ForeignKey(() => ProjectPitch)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare pitch_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  // ✅ FIXED
  declare user_id: CreationOptional<string | null>;

  // ======================================================
  // COMMENT
  // ======================================================

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  // ======================================================
  // ASSOCIATIONS
  // ======================================================

  @BelongsTo(() => ProjectPitch)
  declare pitch?: NonAttribute<ProjectPitch>;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;
}
