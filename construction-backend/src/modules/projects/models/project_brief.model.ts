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
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare project_id: string;

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

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;
}
