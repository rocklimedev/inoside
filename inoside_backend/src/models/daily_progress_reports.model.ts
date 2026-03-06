// src/models/daily-progress-report.model.ts
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
  tableName: "daily_progress_reports",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false, // no updated_at column in original schema
  indexes: [
    // Common lookup patterns
    {
      fields: ["project_id", "report_date"],
      unique: true, // prevents duplicate reports on same date per project
      name: "uk_daily_progress_project_date",
    },
    {
      fields: ["project_id"],
      name: "idx_daily_progress_project_id",
    },
    {
      fields: ["report_date"],
      name: "idx_daily_progress_report_date",
    },
    {
      fields: ["created_by"],
      name: "idx_daily_progress_created_by",
    },
  ],
})
export class DailyProgressReport extends Model {
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
  @Column(DataType.DATEONLY) // DATE in MySQL = DATEONLY in Sequelize
  declare report_date: Date;

  @Column(DataType.STRING(100))
  declare current_stage: string | null;

  @Column(DataType.TEXT)
  declare work_executed: string | null;

  @Column(DataType.INTEGER)
  declare manpower_count: number | null;

  @Column(DataType.JSON)
  declare materials_used: any | null; // MySQL JSON column

  @Column(DataType.TEXT)
  declare issues_faced: string | null;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  declare completion_percent_today: number | null;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare created_by: string | null;

  @BelongsTo(() => User, {
    foreignKey: "created_by",
    as: "createdBy",
  })
  declare createdBy?: User;

  @CreatedAt
  @Default(DataType.NOW)
  declare created_at: Date;
}
