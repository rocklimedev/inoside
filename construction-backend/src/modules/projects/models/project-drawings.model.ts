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
import { User } from '@/modules/users/models/user.model';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
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
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @Column(
    DataType.ENUM(
      'Design',
      'Execution',
      'Technical',
      'Construction',
      'Working',
    ),
  )
  declare drawing_type: any;

  @Column(DataType.INTEGER)
  declare version: number;

  @Column(DataType.STRING)
  declare area_floor: string;

  @Column(DataType.STRING)
  declare file_url: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare uploaded_by: string;

  @Column(DataType.BOOLEAN)
  declare approved: boolean;

  @Column(DataType.DATE)
  declare approval_date: Date;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare approved_by: string;
}
