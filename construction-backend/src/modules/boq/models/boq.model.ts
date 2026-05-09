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
import { BoqCategory } from './boq-category.model';
import { BoqSection } from './boq-section.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'boqs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Boq extends Model<
  InferAttributes<Boq>,
  InferCreationAttributes<Boq>
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

  @ForeignKey(() => BoqCategory)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare boq_category_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare code: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(50),
    defaultValue: 'Rev-01',
  })
  declare revision_no: CreationOptional<string>;

  @Column({
    type: DataType.ENUM(
      'draft',
      'submitted',
      'approved',
      'rejected',
      'revised',
    ),
    defaultValue: 'draft',
  })
  declare status: CreationOptional<
    'draft' | 'submitted' | 'approved' | 'rejected' | 'revised'
  >;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes: CreationOptional<string | null>;

  @Column({
    type: DataType.DECIMAL(16, 2),
    defaultValue: 0,
  })
  declare subtotal: CreationOptional<number>;

  @Column({
    type: DataType.DECIMAL(16, 2),
    defaultValue: 0,
  })
  declare tax_amount: CreationOptional<number>;

  @Column({
    type: DataType.DECIMAL(16, 2),
    defaultValue: 0,
  })
  declare grand_total: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare prepared_by: CreationOptional<string | null>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare approved_by: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @BelongsTo(() => BoqCategory)
  declare category?: NonAttribute<BoqCategory>;

  @HasMany(() => BoqSection)
  declare sections?: NonAttribute<BoqSection[]>;
}
