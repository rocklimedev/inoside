// src/models/vendor-quotation.model.ts
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
  Index,
} from "sequelize-typescript";
import { Project } from "./project.model";
import { Vendor } from "./vendors.model";

@Table({
  tableName: "vendor_quotations",
  timestamps: true,
  createdAt: "submitted_at",
  updatedAt: false, // no updated_at in original schema
  indexes: [
    {
      fields: ["project_id"],
      name: "idx_vendor_quotations_project_id",
    },
    {
      fields: ["vendor_id"],
      name: "idx_vendor_quotations_vendor_id",
    },
    {
      fields: ["project_id", "trade_category"],
      name: "idx_vendor_quotations_project_trade",
    },
    {
      fields: ["project_id", "vendor_id", "trade_category"],
      unique: true, // prevents duplicate quotes from same vendor for same trade in one project
      name: "uk_vendor_quotations_project_vendor_trade",
    },
  ],
})
export class VendorQuotation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string | null;

  @BelongsTo(() => Project, {
    foreignKey: "project_id",
    onDelete: "CASCADE",
  })
  declare project?: Project;

  @ForeignKey(() => Vendor)
  @Column(DataType.UUID)
  declare vendor_id: string | null;

  @BelongsTo(() => Vendor, {
    foreignKey: "vendor_id",
    onDelete: "SET NULL",
  })
  declare vendor?: Vendor;

  @Column(DataType.STRING(100))
  declare trade_category: string | null; // e.g. 'Civil', 'Electrical', 'Plumbing', 'False Ceiling', 'Painting', 'Woodwork'

  @Column(DataType.JSON)
  declare raw_quote_data: any | null; // full quote breakdown, items, rates, terms, etc.

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare total_amount: number | null;

  @CreatedAt
  @Default(DataType.NOW)
  declare submitted_at: Date;
}
