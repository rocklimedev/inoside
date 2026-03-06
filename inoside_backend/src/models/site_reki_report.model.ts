// src/models/site-reki-report.model.ts
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
import { User } from "./user.model";

@Table({
  tableName: "site_reki_report",
  timestamps: true,
  createdAt: "completed_at", // using completed_at as the main creation timestamp
  updatedAt: false, // no updated_at in your original schema
  indexes: [
    {
      unique: true,
      fields: ["project_id"],
      name: "uk_site_reki_project_id",
    },
    {
      fields: ["project_id"],
      name: "idx_site_reki_project_id",
    },
    {
      fields: ["supervisor_id"],
      name: "idx_site_reki_supervisor_id",
    },
    {
      fields: ["visit_date"],
      name: "idx_site_reki_visit_date",
    },
  ],
})
export class SiteRekiReport extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @BelongsTo(() => Project, {
    foreignKey: "project_id",
    onDelete: "CASCADE",
  })
  declare project?: Project;

  @Column(DataType.DATEONLY)
  declare visit_date: Date | null;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare supervisor_id: string | null;

  @BelongsTo(() => User, {
    foreignKey: "supervisor_id",
    as: "supervisor",
  })
  declare supervisor?: User;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare client_present: boolean;

  // ── Site condition flags ─────────────────────────────────────────────
  @Column(DataType.BOOLEAN)
  declare road_access: boolean | null;

  @Column(DataType.BOOLEAN)
  declare unloading_space: boolean | null;

  @Column(DataType.STRING(100))
  declare plot_type: string | null; // e.g. 'Corner', 'Interior', 'East-facing', 'Irregular'

  @Column(DataType.STRING(100))
  declare construction_type: string | null; // e.g. 'New Plot', 'Old Structure', 'G+2 Existing', 'Under Construction'

  @Column(DataType.BOOLEAN)
  declare cracks: boolean | null;

  @Column(DataType.BOOLEAN)
  declare dampness: boolean | null;

  @Column(DataType.BOOLEAN)
  declare termite: boolean | null;

  @Column(DataType.BOOLEAN)
  declare electrical_wiring: boolean | null;

  @Column(DataType.BOOLEAN)
  declare demolition_required: boolean | null;

  @Column(DataType.BOOLEAN)
  declare load_bearing_changes: boolean | null;

  @Column(DataType.BOOLEAN)
  declare power_supply: boolean | null;

  // ── Textual observations & recommendations ──────────────────────────
  @Column(DataType.TEXT)
  declare remarks: string | null;

  @Column(DataType.TEXT)
  declare major_constraints: string | null;

  @Column(DataType.TEXT)
  declare risk_factors: string | null;

  @Column(DataType.TEXT)
  declare suggestions: string | null;

  @Column(DataType.TEXT)
  declare client_instructions: string | null;

  // ── Timestamp ───────────────────────────────────────────────────────
  @CreatedAt
  @Default(DataType.NOW)
  declare completed_at: Date;
}
