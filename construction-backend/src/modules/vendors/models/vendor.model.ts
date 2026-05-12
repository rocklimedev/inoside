// models/vendor.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { ProjectVendor } from './project-vendor.model';
import { VendorType } from './vendor-type.model';
import { VendorTypeVendor } from './vendor-type-vendor.model';

@Table({
  tableName: 'vendors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
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
    type: DataType.STRING(20),
    allowNull: false,
  })
  declare mobile_number: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare brand_company_id: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare company_name: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare position: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare type_of_business: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare optional_mobile: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare area_covered: CreationOptional<string | null>;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare is_architect: CreationOptional<boolean>;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare is_interior: CreationOptional<boolean>;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare is_furniture: CreationOptional<boolean>;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare age: CreationOptional<number | null>;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare dob: CreationOptional<Date | null>;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare reference_name: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare reference_mobile: CreationOptional<string | null>;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare address: CreationOptional<Record<string, any> | null>;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare is_active: CreationOptional<boolean>;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare created_by: CreationOptional<string | null>;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare updated_by: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @HasMany(() => ProjectVendor)
  declare projectVendors?: NonAttribute<ProjectVendor[]>;

  @BelongsToMany(() => VendorType, () => VendorTypeVendor)
  declare vendorTypes?: NonAttribute<VendorType[]>;
}
