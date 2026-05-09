import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { ProjectVendor } from './project-vendor.model';

@Table({
  tableName: 'vendors',
  timestamps: true,
})
export class Vendor extends Model<
  InferAttributes<Vendor>,
  InferCreationAttributes<Vendor>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare trade_type: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare contact_details: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @HasMany(() => ProjectVendor)
  declare projectVendors?: NonAttribute<ProjectVendor[]>;
}
