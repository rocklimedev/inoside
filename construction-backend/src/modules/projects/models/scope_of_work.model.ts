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
  tableName: 'scope_of_work',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ScopeOfWork extends Model<
  InferAttributes<ScopeOfWork>,
  InferCreationAttributes<ScopeOfWork>
> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare project_id: string;

  @Column(DataType.TEXT) declare scope_summary: string;

  @Column(DataType.JSON) declare civil_works: any;
  @Column(DataType.JSON) declare mep_works: any;
  @Column(DataType.JSON) declare interior_works: any;
  @Column(DataType.JSON) declare finishes: any;
  @Column(DataType.JSON) declare area_summary: any;

  @Column(DataType.STRING) declare scope_pdf_url: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;
}
