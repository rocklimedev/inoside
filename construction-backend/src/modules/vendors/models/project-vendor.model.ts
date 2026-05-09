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

import { Project } from '../../projects/models/project.model';
import { Vendor } from './vendor.model';

@Table({
  tableName: 'project_vendors',
  timestamps: true,
})
export class ProjectVendor extends Model<
  InferAttributes<ProjectVendor>,
  InferCreationAttributes<ProjectVendor>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare project_id: string;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare vendor_id: CreationOptional<string | null>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare selected: CreationOptional<boolean>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare selection_reason: CreationOptional<string | null>;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  declare approved_estimate_value: CreationOptional<number | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare scope_summary: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare final_estimate_url: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @BelongsTo(() => Vendor)
  declare vendor?: NonAttribute<Vendor>;
}
