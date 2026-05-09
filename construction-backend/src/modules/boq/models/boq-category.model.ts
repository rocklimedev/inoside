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

import { Project } from '@/modules/projects/models/project.model';
import { Boq } from './boq.model';

@Table({
  tableName: 'boq_categories',
  timestamps: true,
})
export class BoqCategory extends Model<
  InferAttributes<BoqCategory>,
  InferCreationAttributes<BoqCategory>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare project_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

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

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @HasMany(() => Boq)
  declare boqs?: NonAttribute<Boq[]>;
}
