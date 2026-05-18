// ======================================================
// 📁 project_pitch.model.ts
// ======================================================

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

import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';
import { PitchComment } from './pitch-comment.model';

@Table({
  tableName: 'project_pitch',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProjectPitch extends Model<
  InferAttributes<ProjectPitch>,
  InferCreationAttributes<ProjectPitch>
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

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare project_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare created_by: CreationOptional<string | null>;

  // ======================================================
  // BASIC DETAILS
  // ======================================================

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare preferred_design_style: CreationOptional<string | null>;

  @Column({
    type: DataType.ENUM('Light', 'Dark', 'Mixed', 'Not Sure'),
    allowNull: true,
  })
  declare color_tone: 'Light' | 'Dark' | 'Mixed' | 'Not Sure' | null;

  @Column({
    type: DataType.ENUM('Low', 'Medium', 'High'),
    allowNull: true,
  })
  declare luxury_level: 'Low' | 'Medium' | 'High' | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare functional_vs_aesthetic: CreationOptional<string | null>;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare budget_flexibility: CreationOptional<boolean | null>;

  // ======================================================
  // JSON FIELDS
  // ======================================================

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare priority_areas: CreationOptional<any | null>;

  // ======================================================
  // NOTES
  // ======================================================

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare likes_dislikes: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare non_negotiables: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare special_requirements: CreationOptional<string | null>;

  // ======================================================
  // FILES
  // ======================================================

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare moodboard_pdf_url: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare pitch_pdf_url: CreationOptional<string | null>;

  // ======================================================
  // STATUS
  // ======================================================

  @Default('Draft')
  @Column({
    type: DataType.ENUM('Draft', 'Pending Review', 'Approved', 'Rejected'),
    allowNull: false,
  })
  declare status: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected';

  // ======================================================
  // ASSOCIATIONS
  // ======================================================

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @BelongsTo(() => User, 'created_by')
  declare createdByUser?: NonAttribute<User>;

  @HasMany(() => PitchComment)
  declare comments?: NonAttribute<PitchComment[]>;
}
