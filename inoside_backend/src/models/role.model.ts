import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  HasMany,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Permission } from "./permission.model";
import { RolePermission } from "./rolePermission.model";
import { User } from "./user.model";

export interface RoleAttributes {
  roleId: string;
  roleName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleCreationAttributes {
  roleName: string;
}

@Table({ tableName: "roles", timestamps: true })
export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare roleId: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare roleName: string;

  @HasMany(() => RolePermission)
  declare rolepermissions?: RolePermission[];

  @BelongsToMany(() => Permission, () => RolePermission)
  declare permissions?: Permission[];

  @HasMany(() => User)
  declare users?: User[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
