import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { Role } from './role.model';
import { Permission } from './permission.model';

@Table({
  tableName: 'role_permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // 👈 IMPORTANT
})
export class RolePermission extends Model<
  InferAttributes<RolePermission>,
  InferCreationAttributes<RolePermission>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare role_id: string;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare permission_id: string;
}
