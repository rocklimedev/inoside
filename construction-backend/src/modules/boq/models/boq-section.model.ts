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
import { BoqSubHeading } from './boq-subheading.model';
import { Boq } from './boq.model';
import { BoqItem } from './boq-item.model';

@Table({
  tableName: 'boq_sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BoqSection extends Model<
  InferAttributes<BoqSection>,
  InferCreationAttributes<BoqSection>
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
  @HasMany(() => BoqSubHeading)
  declare subheadings?: NonAttribute<BoqSubHeading[]>;
  @BelongsTo(() => Boq)
  declare boq?: NonAttribute<Boq>;
}
