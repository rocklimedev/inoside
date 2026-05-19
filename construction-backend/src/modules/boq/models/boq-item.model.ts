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

import { Boq } from './boq.model';
import { BoqSection } from './boq-section.model';
import { BoqSubHeading } from './boq-subheading.model';
import { Unit } from './unit.model';
import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';

@Table({
  tableName: 'boq_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BoqItem extends Model<
  InferAttributes<BoqItem>,
  InferCreationAttributes<BoqItem>
> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  // ================= FOREIGN KEYS =================

  @ForeignKey(() => Boq)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare boq_id: string;

  @ForeignKey(() => BoqSection)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare section_id: string;

  @ForeignKey(() => BoqSubHeading)
  @Column({ type: DataType.CHAR(36), allowNull: true })
  declare subheading_id: CreationOptional<string | null>;

  // ✅ MUST MATCH DB COLUMN NAME
  @ForeignKey(() => InventoryMaster)
  @Column({ type: DataType.CHAR(36), allowNull: true })
  declare inventory_master_id: CreationOptional<string | null>;

  @ForeignKey(() => Unit)
  @Column({ type: DataType.CHAR(36), allowNull: true })
  declare unit_id: CreationOptional<string | null>;

  // ================= BASIC INFO =================

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare sno: CreationOptional<string | null>;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare item_code: CreationOptional<string | null>;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare item_name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: CreationOptional<string | null>;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare specification: CreationOptional<string | null>;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare brand: CreationOptional<string | null>;

  // ================= QUANTITY & RATE =================

  @Column({ type: DataType.DECIMAL(14, 3), defaultValue: 0 })
  declare qty: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0 })
  declare rate: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  declare wastage_percent: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  declare discount_percent: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 18 })
  declare tax_percent: CreationOptional<number>;

  // ================= GENERATED COLUMNS =================

  @Column({ type: DataType.DECIMAL(16, 2), allowNull: true })
  declare base_amount: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(16, 2), allowNull: true })
  declare tax_amount: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(16, 2), allowNull: true })
  declare final_amount: CreationOptional<number>;

  // ================= OTHER =================

  @Column({ type: DataType.TEXT, allowNull: true })
  declare remarks: CreationOptional<string | null>;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare sort_order: CreationOptional<number>;

  // ================= RELATIONS =================

  @BelongsTo(() => Boq)
  declare boq?: NonAttribute<Boq>;

  @BelongsTo(() => BoqSection)
  declare section?: NonAttribute<BoqSection>;

  @BelongsTo(() => BoqSubHeading)
  declare subheading?: NonAttribute<BoqSubHeading>;

  @BelongsTo(() => InventoryMaster, {
    foreignKey: 'inventory_master_id',
  })
  declare inventory_master?: NonAttribute<InventoryMaster>;

  @BelongsTo(() => Unit)
  declare unit?: NonAttribute<Unit>;
}
