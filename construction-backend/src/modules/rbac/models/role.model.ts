import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { User } from '@/modules/users/models/user.model';
import { Permission } from './permission.model';
import { RolePermission } from './role-permission.model';

@Table({
  tableName: 'roles',
  timestamps: true,
})
export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare display_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @HasMany(() => User)
  declare users?: NonAttribute<User[]>;

  @BelongsToMany(() => Permission, () => RolePermission)
  declare permissions?: NonAttribute<Permission[]>;
}
