import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsTo,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt,
  Index,
} from "sequelize-typescript";
import { Address } from "./address.model";
import { Role } from "./role.model"; // Import Role model

@Table({
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      unique: true,
      fields: ["email"],
      name: "uk_users_email",
    },
  ],
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare full_name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  declare email: string;

  @Column(DataType.STRING(20))
  declare phone: string | null;

  // ── Role as foreign key ───────────────────────────────
  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare roleId: string;

  @BelongsTo(() => Role, {
    foreignKey: "roleId",
    onDelete: "RESTRICT", // or "SET NULL" if you prefer
    as: "role",
  })
  declare role?: Role;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_active: boolean;

  // ── Primary address (soft reference) ─────────────────
  @ForeignKey(() => Address)
  @Column(DataType.UUID)
  declare primary_address_id: string | null;

  @BelongsTo(() => Address, {
    foreignKey: "primary_address_id",
    onDelete: "SET NULL",
    as: "primaryAddress",
  })
  declare primaryAddress?: Address;

  // ── Standard timestamps & optimistic locking ───────
  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  declare lock_version: number;

  @BeforeUpdate
  static setUpdatedAt(instance: User) {
    instance.updated_at = new Date();
  }
}
