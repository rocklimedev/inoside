import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Role } from './role.model';
import { RolePermission } from './role-permission.model';

@Table({
  tableName: 'permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // 👈 IMPORTANT
})
export class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare module: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare action: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @BelongsToMany(() => Role, () => RolePermission)
  declare roles?: NonAttribute<Role[]>;
}
