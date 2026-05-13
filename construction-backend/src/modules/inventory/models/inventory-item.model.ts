import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Unit } from '@/modules/boq/models/unit.model';
import { BoqItem } from '@/modules/boq/models/boq-item.model';

@Table({
  tableName: 'inventory_master',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class InventoryItem extends Model<
  InferAttributes<InventoryItem>,
  InferCreationAttributes<InventoryItem>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

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
  declare description: CreationOptional<string | null>;

  @ForeignKey(() => Unit)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare unit_id: CreationOptional<string | null>;

  @Column({
    type: DataType.DECIMAL(14, 2),
    defaultValue: 0,
  })
  declare default_rate: CreationOptional<number>;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare brand: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare specification: CreationOptional<string | null>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: CreationOptional<boolean>;

  // ================= RELATIONS =================

  @BelongsTo(() => Unit)
  declare unit?: NonAttribute<Unit>;

  @HasMany(() => BoqItem)
  declare boq_items?: NonAttribute<BoqItem[]>;
}
