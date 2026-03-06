// src/models/vendor.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  Index,
} from "sequelize-typescript";
import { Address } from "./address.model";
@Table({
  tableName: "vendors",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      fields: ["trade_type"],
      name: "idx_vendors_trade_type",
    },
    {
      fields: ["is_active"],
      name: "idx_vendors_is_active",
    },
    {
      fields: ["rating"],
      name: "idx_vendors_rating",
    },
    {
      fields: ["name"],
      name: "idx_vendors_name",
    },
  ],
})
export class Vendor extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare name: string;

  @Column(DataType.STRING(100))
  declare trade_type: string | null; // e.g. 'Civil', 'Electrical', 'Plumbing', 'Painting', 'False Ceiling', 'Woodwork', 'HVAC'

  @Column(DataType.STRING(100))
  declare contact_person: string | null;

  @Column(DataType.STRING(20))
  declare phone: string | null;

  @Column(DataType.STRING(255))
  declare email: string | null;

  // ── Primary address (soft reference) ─────────────────────────────────
  @ForeignKey(() => Address)
  @Column(DataType.UUID)
  declare primary_address_id: string | null;

  @BelongsTo(() => Address, {
    foreignKey: "primary_address_id",
    onDelete: "SET NULL",
    as: "primaryAddress",
  })
  declare primaryAddress?: Address;

  // ── Performance & Status ─────────────────────────────────────────────
  @Column({
    type: DataType.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 0,
      max: 5,
    },
  })
  declare rating: number | null; // e.g. 4.5

  @Column(DataType.JSON)
  declare past_performance: any | null; // e.g. { projectsCompleted: 12, onTimeRate: 0.92, avgRating: 4.3, notes: "..." }

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_active: boolean;

  // ── Metadata ─────────────────────────────────────────────────────────
  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  declare lock_version: number;
}
