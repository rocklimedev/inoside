import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { Project } from '@/modules/projects/models/project.model';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
@Table({
  tableName: 'pitch_references',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class PitchReference extends Model<
  InferAttributes<PitchReference>,
  InferCreationAttributes<PitchReference>
> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  declare project_id: string;

  @Column(DataType.ENUM('image', 'link', 'portfolio'))
  declare reference_type: 'image' | 'link' | 'portfolio';

  @Column(DataType.TEXT)
  declare url: string;

  @Column(DataType.TEXT)
  declare description: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;
}
