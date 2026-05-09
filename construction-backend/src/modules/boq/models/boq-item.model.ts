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
import { Unit } from './unit.model';

@Table({
  tableName: 'boq_items',
  timestamps: true,
})
export class BoqItem extends Model<
  InferAttributes<BoqItem>,
  InferCreationAttributes<BoqItem>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Boq)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare boq_id: string;

  @ForeignKey(() => BoqSection)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare section_id: string;

  @ForeignKey(() => Unit)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare unit_id: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare sno: CreationOptional<string | null>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare item_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: CreationOptional<string | null>;

  @Column({
    type: DataType.DECIMAL(14, 2),
    defaultValue: 0,
  })
  declare qty: CreationOptional<number>;

  @Column({
    type: DataType.DECIMAL(14, 2),
    defaultValue: 0,
  })
  declare rate: CreationOptional<number>;

  @Column({
    type: DataType.DECIMAL(16, 2),
    defaultValue: 0,
  })
  declare amount: CreationOptional<number>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare remarks: CreationOptional<string | null>;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare sort_order: CreationOptional<number>;

  // ================= RELATIONS =================

  @BelongsTo(() => Boq)
  declare boq?: NonAttribute<Boq>;

  @BelongsTo(() => BoqSection)
  declare section?: NonAttribute<BoqSection>;

  @BelongsTo(() => Unit)
  declare unit?: NonAttribute<Unit>;
}
