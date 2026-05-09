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

import { Project } from '../../projects/models/project.model';

@Table({
  tableName: 'clients',
  timestamps: true,
})
export class Client extends Model<
  InferAttributes<Client>,
  InferCreationAttributes<Client>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare contact_number: string;

  @Column({
    type: DataType.STRING(255),
    unique: true,
    allowNull: true,
  })
  declare email: CreationOptional<string | null>;

  @Column({
    type: DataType.ENUM('Call', 'WhatsApp', 'Email'),
    allowNull: true,
  })
  declare preferred_communication: CreationOptional<
    'Call' | 'WhatsApp' | 'Email' | null
  >;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_owner: CreationOptional<boolean>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare representative_involved: CreationOptional<boolean>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare representative_comment: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @HasMany(() => Project)
  declare projects?: NonAttribute<Project[]>;
}
