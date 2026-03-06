import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  HasMany,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { RolePermission } from "./rolePermission.model";
import { Role } from "./role.model";

// ---------------------------
// Interface Definitions
// ---------------------------
export type PermissionApi = "view" | "delete" | "write" | "edit" | "export";

export interface PermissionAttributes {
  permissionId: string;
  api: PermissionApi;
  name: string;
  route: string;
  module: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionCreationAttributes extends Partial<PermissionAttributes> {}

// ---------------------------
// Model Definition
// ---------------------------
@Table({
  tableName: "permissions",
  timestamps: true,
})
export class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare permissionId: string;

  @AllowNull(false)
  @Column(DataType.ENUM("view", "delete", "write", "edit", "export"))
  declare api: PermissionApi;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    comment: "Human-readable name for the permission",
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(500),
    comment: "Actual route path like /user/create or /orders/export",
  })
  declare route: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare module: string;

  // ---------------------------
  // Associations
  // ---------------------------
  @HasMany(() => RolePermission, "permissionId")
  declare rolepermission_links?: RolePermission[];

  @BelongsToMany(() => Role, () => RolePermission, "permissionId", "roleId")
  declare roles?: Role[];

  // ---------------------------
  // Timestamps
  // ---------------------------
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
