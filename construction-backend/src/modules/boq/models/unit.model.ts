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

import { BoqItem } from './boq-item.model';

@Table({
  tableName: 'units',
  timestamps: true,
})
export class Unit extends Model<
  InferAttributes<Unit>,
  InferCreationAttributes<Unit>
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
  })
  declare name: string;

  @Column({
    type: DataType.STRING(20),
    unique: true,
    allowNull: false,
  })
  declare short_name: string;

  // ================= RELATIONS =================

  @HasMany(() => BoqItem)
  declare boqItems?: NonAttribute<BoqItem[]>;
}
