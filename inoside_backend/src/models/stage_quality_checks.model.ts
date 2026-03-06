// src/models/stage-quality-check.model.ts
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
  tableName: "stage_quality_checks",
  timestamps: true,
  createdAt: "checked_at",
  updatedAt: false, // no updated_at in your original schema
  indexes: [
    {
      fields: ["project_id"],
      name: "idx_stage_quality_checks_project_id",
    },
    {
      fields: ["project_id", "stage_name"],
      unique: true, // one quality check per stage per project (most common pattern)
      name: "uk_stage_quality_checks_project_stage",
    },
    {
      fields: ["stage_name"],
      name: "idx_stage_quality_checks_stage_name",
    },
    {
      fields: ["checked_by"],
      name: "idx_stage_quality_checks_checked_by",
    },
  ],
})
export class StageQualityCheck extends Model {
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
  declare stage_name: string | null; // e.g. 'Foundation', 'Plinth Beam', 'Brickwork', 'Plastering', 'Flooring', 'Painting'

  @Column(DataType.BOOLEAN)
  declare quality_met: boolean | null;

  @Column(DataType.BOOLEAN)
  declare deviations: boolean | null;

  @Column(DataType.TEXT)
  declare corrective_action: string | null;

  @Column(DataType.TEXT)
  declare supervisor_remarks: string | null;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare checked_by: string | null;

  @BelongsTo(() => User, {
    foreignKey: "checked_by",
    as: "checkedBy",
  })
  declare checkedBy?: User;

  @CreatedAt
  @Default(DataType.NOW)
  declare checked_at: Date;
}
