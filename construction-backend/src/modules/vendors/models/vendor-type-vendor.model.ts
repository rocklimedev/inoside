// models/vendor-type-vendor.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

import { Vendor } from './vendor.model';
import { VendorType } from './vendor-type.model';

@Table({
  tableName: 'vendor_type_vendor',
  timestamps: false,
})
export class VendorTypeVendor extends Model {
  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare vendor_id: string;

  @ForeignKey(() => VendorType)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare type_id: string;
}
