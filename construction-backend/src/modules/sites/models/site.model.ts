import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Project } from '../../projects/models/project.model';

import { Address } from '@/modules/address/models/address.model';

import { Client } from '@/modules/clients/models/client.model';

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

  // ======================================================
  // CLIENT
  // ======================================================

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,

    allowNull: false,
  })
  declare client_id: string;

  @BelongsTo(() => Client)
  declare client?: NonAttribute<Client>;

  // ======================================================
  // ADDRESS
  // ======================================================

  @ForeignKey(() => Address)
  @Column({
    type: DataType.UUID,

    allowNull: false,
  })
  declare address_id: string;

  @BelongsTo(() => Address)
  declare address?: NonAttribute<Address>;

  // ======================================================
  // SITE DETAILS
  // ======================================================

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

  // ======================================================
  // TIMESTAMPS
  // ======================================================

  @Column(DataType.DATE)
  declare created_at: CreationOptional<Date>;

  @Column(DataType.DATE)
  declare updated_at: CreationOptional<Date>;

  // ======================================================
  // RELATIONS
  // ======================================================

  @HasMany(() => Project)
  declare projects?: NonAttribute<Project[]>;
}
