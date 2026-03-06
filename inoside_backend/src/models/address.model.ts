// src/models/address.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  Index,
  ForeignKey, // if you later add relations
} from "sequelize-typescript";

// Optional: define as const or enum for better type safety
export const ADDRESS_TYPES = [
  "residential",
  "billing",
  "correspondence",
  "office",
  "project_site",
  "temporary",
  "warehouse",
  "other",
] as const;

export type AddressTypeEnum = (typeof ADDRESS_TYPES)[number];

@Table({
  tableName: "addresses",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  // MySQL-compatible unique constraint on 4 columns
  indexes: [
    {
      unique: true,
      name: "unique_entity_address",
      fields: ["entity_type", "entity_id", "address_type", "is_primary"],
    },
    // Useful composite indexes (same as your original schema)
    {
      name: "idx_addresses_entity",
      fields: ["entity_type", "entity_id"],
    },
    {
      name: "idx_addresses_primary",
      fields: ["entity_type", "entity_id"],
      where: { is_primary: true },
    },
    {
      name: "idx_addresses_location",
      fields: ["country", "state_province", "city", "postal_code"],
    },
  ],
})
export class Address extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4) // Sequelize generates uuid v4 in JS
  @Column({
    type: DataType.UUID, // CHAR(36) in MySQL
    allowNull: false,
  })
  declare id: string;

  // ── Polymorphic fields ─────────────────────────────────────
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare entity_type: "users" | "projects" | "vendors"; // or string literal union

  @AllowNull(false)
  @Column(DataType.UUID)
  declare entity_id: string;

  // ── Address fields ─────────────────────────────────────────
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare line1: string;

  @Column(DataType.STRING(255))
  declare line2: string | null;

  @Column(DataType.STRING(150))
  declare landmark: string | null;

  @Column(DataType.STRING(150))
  declare locality_area: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare city: string;

  @Column(DataType.STRING(100))
  declare state_province: string | null;

  @Column(DataType.STRING(20))
  declare postal_code: string | null;

  @Default("India")
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare country: string;

  // ── Enum ───────────────────────────────────────────────────
  @Default("project_site")
  @Column(DataType.ENUM(...ADDRESS_TYPES))
  declare address_type: AddressTypeEnum;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_primary: boolean;

  @Column(DataType.TEXT)
  declare notes: string | null;

  // ── Standard timestamps ────────────────────────────────────
  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // Optional: optimistic locking field (you increment manually or use version: true)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  declare lock_version: number;
}
