import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { InventoryRequest } from './inventory-request.model';

@Table({
  tableName: 'inventory_dispatches',
  timestamps: false,
})
export class InventoryDispatch extends Model<InventoryDispatch> {
  @PrimaryKey
  @Column({
    type: DataType.CHAR(36),
  })
  declare id: string;

  @ForeignKey(() => InventoryRequest)
  @Column({
    type: DataType.CHAR(36),
    allowNull: false,
  })
  declare request_id: string;

  @BelongsTo(() => InventoryRequest)
  declare request: InventoryRequest;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dispatch_date: Date;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare dispatch_quantity: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare vehicle_challan: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare received_quantity: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare damage_shortage: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare supervisor_confirmation: boolean;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare delivery_photo_url: string;
}
