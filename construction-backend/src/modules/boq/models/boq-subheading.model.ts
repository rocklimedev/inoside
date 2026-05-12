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

import { BoqSection } from './boq-section.model';
import { BoqItem } from './boq-item.model';
import { Boq } from './boq.model';
@Table({
  tableName: 'boq_subheadings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BoqSubHeading extends Model<
  InferAttributes<BoqSubHeading>,
  InferCreationAttributes<BoqSubHeading>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => BoqSection)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare section_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: CreationOptional<string | null>;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare sort_order: CreationOptional<number>;

  // ================= RELATIONS =================
  @ForeignKey(() => Boq)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare boq_id?: string;
  @BelongsTo(() => BoqSection)
  declare section?: NonAttribute<BoqSection>;

  @HasMany(() => BoqItem)
  declare items?: NonAttribute<BoqItem[]>;
}
