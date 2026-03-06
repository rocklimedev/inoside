// src/models/project.model.ts
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
  HasOne,
  HasMany,
  CreatedAt,
  UpdatedAt,
  Index,
} from "sequelize-typescript";

// Assuming you have these enums defined in a central file (e.g. types/db.ts)
import {
  ProjectType,
  ProjectPurpose,
  DesignPreference,
  DecisionReadiness,
  ColorTone,
  LuxuryLevel,
} from "../types/db"; // adjust path
import { User } from "./user.model";
import { Address } from "./address.model";

// import other related models as needed: ProjectProposal, ProjectScope, etc.

@Table({
  tableName: "projects",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      fields: ["client_user_id", "status"],
      name: "idx_projects_client_status",
    },
    {
      fields: ["overall_completion"],
      name: "idx_projects_completion",
    },
    {
      fields: ["status"],
      name: "idx_projects_status",
    },
    {
      fields: ["primary_site_address_id"],
      name: "idx_projects_primary_address",
    },
  ],
})
export class Project extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare client_user_id: string | null;

  @BelongsTo(() => User, {
    foreignKey: "client_user_id",
    onDelete: "SET NULL",
    as: "client",
  })
  declare client?: User;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare name: string;

  @Column(DataType.ENUM(...Object.values(ProjectType)))
  declare project_type: ProjectType | null;

  @Column(DataType.ENUM(...Object.values(ProjectPurpose)))
  declare purpose: ProjectPurpose | null;

  @Column(DataType.INTEGER)
  declare num_floors: number | null;

  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  declare approx_area: number | null; // in sq.ft or sq.m – consider adding unit field if needed

  @Column(DataType.STRING(50))
  declare budget_range: string | null; // e.g. '50-75 Lakhs', '1-2 Crore'

  @Column(DataType.STRING(50))
  declare timeline_expectation: string | null; // e.g. '6-9 months', '12-18 months'

  @Column(DataType.ENUM(...Object.values(DesignPreference)))
  declare design_preference: DesignPreference | null;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_first_project: boolean;

  @Column(DataType.ENUM(...Object.values(DecisionReadiness)))
  declare decision_readiness: DecisionReadiness | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare worked_with_before: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare end_to_end: boolean;

  @Default("brief")
  @Column(DataType.STRING(30))
  declare status: string; // e.g. 'brief', 'proposal', 'design', 'execution', 'handover', 'completed'

  @Column(DataType.STRING(50))
  declare current_stage: string | null; // e.g. 'Site Preparation', 'Plastering', 'Finishing'

  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
  })
  declare overall_completion: number;

  // ── Design & Preference fields ───────────────────────────────────────
  @Column(DataType.STRING(100))
  declare preferred_style: string | null; // e.g. 'Contemporary', 'Scandinavian', 'Indian Traditional'

  @Column(DataType.ENUM(...Object.values(ColorTone)))
  declare color_tone: ColorTone | null;

  @Column(DataType.ENUM(...Object.values(LuxuryLevel)))
  declare luxury_level: LuxuryLevel | null;

  @Column({
    type: DataType.DECIMAL(3, 1),
  })
  declare func_vs_aesth: number | null; // e.g. 7.5 → 75% function / 25% aesthetics

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare budget_flexible: boolean;

  @Column(DataType.JSON)
  declare priority_areas: any | null; // e.g. { kitchen: 9, master_bedroom: 8, ... }

  @Column(DataType.TEXT)
  declare likes_dislikes: string | null;

  @Column(DataType.TEXT)
  declare non_negotiables: string | null;

  @Column(DataType.TEXT)
  declare special_req: string | null;

  // ── Address relation ─────────────────────────────────────────────────
  @ForeignKey(() => Address)
  @Column(DataType.UUID)
  declare primary_site_address_id: string | null;

  @BelongsTo(() => Address, {
    foreignKey: "primary_site_address_id",
    onDelete: "SET NULL",
  })
  declare primarySiteAddress?: Address;

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

  // ── Common relations (add as needed) ─────────────────────────────────
  // @HasOne(() => ProjectProposal) declare proposal?: ProjectProposal;
  // @HasOne(() => ProjectScope)    declare scope?: ProjectScope;
  // @HasMany(() => DailyProgressReport) declare progressReports: DailyProgressReport[];
  // @HasMany(() => ProjectIssue)   declare issues: ProjectIssue[];
}
