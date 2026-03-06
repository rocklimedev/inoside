import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  Index,
} from "sequelize-typescript";
import { Role } from "./role.model";
import { Permission } from "./permission.model";

export interface RolePermissionAttributes {
  id: string;
  roleId?: string | null;
  permissionId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RolePermissionCreationAttributes extends Partial<RolePermissionAttributes> {}

// ---------------------------------
// Model Definition
// ---------------------------------
@Table({
  tableName: "rolepermissions",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["roleId", "permissionId"] },
    { fields: ["permissionId"] },
  ],
})
export class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.CHAR(36))
  declare id: string;

  @ForeignKey(() => Role)
  @Column(DataType.CHAR(36))
  declare roleId?: string | null;

  @ForeignKey(() => Permission)
  @Column(DataType.CHAR(36))
  declare permissionId?: string | null;

  @BelongsTo(() => Role, { as: "role", foreignKey: "roleId" })
  declare role?: Role;

  @BelongsTo(() => Permission, { as: "permission", foreignKey: "permissionId" })
  declare permission?: Permission;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
