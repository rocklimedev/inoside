// src/models/project-proposal.model.ts
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
import { Project } from "./project.model";
import { User } from "./user.model";

// Optional: better type safety for proposal types
export const PROPOSAL_TYPES = [
  "consultation",
  "turnkey",
  "builder_model",
] as const;

export type ProposalType = (typeof PROPOSAL_TYPES)[number];

@Table({
  tableName: "project_proposals",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      unique: true,
      fields: ["project_id"],
      name: "uk_project_proposals_project_id",
    },
    {
      fields: ["proposal_type"],
      name: "idx_project_proposals_type",
    },
    {
      fields: ["prepared_by"],
      name: "idx_project_proposals_prepared_by",
    },
  ],
})
export class ProjectProposal extends Model {
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

  @AllowNull(false)
  @Column(DataType.ENUM(...PROPOSAL_TYPES))
  declare proposal_type: ProposalType;

  @Column(DataType.TEXT)
  declare scope_summary: string | null;

  @Column(DataType.TEXT)
  declare notes: string | null;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare prepared_by: string | null;

  @BelongsTo(() => User, {
    foreignKey: "prepared_by",
    as: "preparedBy",
  })
  declare preparedBy?: User;

  // ── Consultation / Preliminary fields ────────────────────────────────
  @Column(DataType.INTEGER) // MySQL has no native INTERVAL → store in days or use separate fields
  declare time_involvement_estimate_days: number | null; // alternative to INTERVAL

  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  declare consultation_fee: number | null;

  @Column(DataType.INTEGER)
  declare duration_months: number | null;

  @Column(DataType.JSON)
  declare deliverables: any | null;

  @Column(DataType.TEXT)
  declare terms_limitations: string | null;

  // ── Turnkey / Full proposal fields ───────────────────────────────────
  @Column(DataType.JSON)
  declare material_labour_estimate: any | null;

  @Column({
    type: DataType.DECIMAL(15, 2),
  })
  declare tentative_cost_estimate: number | null;

  @Column(DataType.JSON)
  declare payment_plan_stages: any | null;

  // ── Contract & Signing ───────────────────────────────────────────────
  @Column(DataType.JSON)
  declare annexure_specs: any | null;

  @Column(DataType.JSON)
  declare buyer_payment_plan: any | null;

  @Column(DataType.TEXT)
  declare contract_template: string | null; // could be path to file / HTML / markdown

  @Column(DataType.STRING(255))
  declare buyer_name: string | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare signed_by_client: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare signed_by_builder: boolean;

  // ── Metadata ─────────────────────────────────────────────────────────
  @CreatedAt
  @Default(DataType.NOW)
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
