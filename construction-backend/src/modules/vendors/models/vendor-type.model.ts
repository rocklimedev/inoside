// models/vendor-type.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Vendor } from './vendor.model';
import { VendorTypeVendor } from './vendor-type-vendor.model';

@Table({
  tableName: 'vendor_types',
  timestamps: false,
})
export class VendorType extends Model<
  InferAttributes<VendorType>,
  InferCreationAttributes<VendorType>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  // ================= RELATIONS =================

  @BelongsToMany(() => Vendor, () => VendorTypeVendor)
  declare vendors?: NonAttribute<Vendor[]>;
}
