// src/models/project-scope.model.ts
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
  HasMany,
  CreatedAt,
  UpdatedAt,
  Index,
} from "sequelize-typescript";
import { Project } from "./project.model";
import { ScopeItem } from "./scope_items.model";

@Table({
  tableName: "project_scopes",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at", // recommended addition
  indexes: [
    {
      unique: true,
      fields: ["project_id"],
      name: "uk_project_scopes_project_id",
    },
    {
      fields: ["project_id"],
      name: "idx_project_scopes_project_id",
    },
  ],
})
export class ProjectScope extends Model {
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

  @Column(DataType.STRING(100))
  declare service_type: string | null; // e.g. 'Turnkey Construction', 'Interior Only', 'Renovation + MEP', 'Shell + Core'

  @Column(DataType.TEXT)
  declare requirements_summary: string | null;

  @Column(DataType.TEXT)
  declare site_summary: string | null;

  // ── Timestamps (not in original schema but strongly recommended) ──────
  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // ── Relation: one ProjectScope → many ScopeItems ─────────────────────
  @HasMany(() => ScopeItem, {
    foreignKey: "scope_id",
    onDelete: "CASCADE",
    as: "items",
  })
  declare items?: ScopeItem[];
}
