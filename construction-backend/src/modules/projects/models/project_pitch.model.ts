import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { Project } from './project.model';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
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
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare project_id: string;

  @Column(DataType.STRING)
  declare preferred_design_style: string;

  @Column(DataType.ENUM('Light', 'Dark', 'Mixed', 'Not Sure'))
  declare color_tone: 'Light' | 'Dark' | 'Mixed' | 'Not Sure';

  @Column(DataType.ENUM('Low', 'Medium', 'High'))
  declare luxury_level: 'Low' | 'Medium' | 'High';

  @Column(DataType.TEXT)
  declare functional_vs_aesthetic: string;

  @Column(DataType.BOOLEAN)
  declare budget_flexibility: boolean;

  @Column(DataType.JSON)
  declare priority_areas: any;

  @Column(DataType.TEXT)
  declare likes_dislikes: string;

  @Column(DataType.TEXT)
  declare non_negotiables: string;

  @Column(DataType.TEXT)
  declare special_requirements: string;

  @Column(DataType.STRING)
  declare moodboard_pdf_url: string;

  @Column(DataType.STRING)
  declare pitch_pdf_url: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;
}
