import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Project } from '../../projects/models/project.model';

@Table({
  tableName: 'sites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Site extends Model<
  InferAttributes<Site>,
  InferCreationAttributes<Site>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare address: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare city: string;

  @Column({
    type: DataType.ENUM('Owned', 'Rented', 'Under Process'),
    allowNull: true,
  })
  declare ownership_status: 'Owned' | 'Rented' | 'Under Process' | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare access_available: CreationOptional<boolean>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare existing_structure: CreationOptional<boolean>;

  // ================= RELATIONS =================

  @HasOne(() => Project)
  declare project?: NonAttribute<Project>;
}
