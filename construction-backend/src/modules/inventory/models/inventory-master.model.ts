import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';

import { Unit } from '@/modules/boq/models/unit.model';
import { Brand } from './brand.model';

@Table({
  tableName: 'inventory_master',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class InventoryMaster extends Model<InventoryMaster> {
  @PrimaryKey
  @Column({
    type: DataType.CHAR(36),
    defaultValue: DataType.UUIDV4, // Recommended
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare item_code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare item_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null; // ← Fixed

  // ================= UNIT =================
  @ForeignKey(() => Unit)
  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
  })
  declare unit_id: string | null; // ← Fixed

  @BelongsTo(() => Unit)
  declare unit?: Unit;

  // ================= BRAND =================
  @ForeignKey(() => Brand)
  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
  })
  declare brand_id: string | null; // ← Fixed

  @BelongsTo(() => Brand)
  declare brand?: Brand;

  // ================= PRICING =================
  @Default(0)
  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
  })
  declare default_rate: number;

  // ================= SPEC =================
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare specification: string | null; // ← Fixed

  // ================= STATUS =================
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare is_active: boolean;

  // ================= TIMESTAMPS =================
  @Column({ type: DataType.DATE })
  declare created_at: Date;

  @Column({ type: DataType.DATE })
  declare updated_at: Date;
}
