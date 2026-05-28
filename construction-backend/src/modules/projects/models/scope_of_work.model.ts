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
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare project_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare scope_summary: string | null;

  @Column({
    type: DataType.JSONB, // ← Changed to JSONB (recommended)
    allowNull: true,
    defaultValue: [], // ← Very Important
  })
  declare civil_works: any[] | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  declare mep_works: any[] | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  declare interior_works: any[] | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  declare finishes: any[] | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  declare area_summary: any[] | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare scope_pdf_url: string | null;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;
}
