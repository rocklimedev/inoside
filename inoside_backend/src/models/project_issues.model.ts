// src/models/project-issue.model.ts
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
import { Attachment } from "./attachment.model";
import { User } from "./user.model";

@Table({
  tableName: "project_issues",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at", // added – very useful for tracking modifications
  indexes: [
    {
      fields: ["project_id"],
      name: "idx_project_issues_project_id",
    },
    {
      fields: ["project_id", "status"],
      name: "idx_project_issues_project_status",
    },
    {
      fields: ["target_resolution_date"],
      name: "idx_project_issues_target_date",
    },
    {
      fields: ["status"],
      name: "idx_project_issues_status",
    },
  ],
})
export class ProjectIssue extends Model {
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
  @Column(DataType.TEXT)
  declare issue_description: string;

  @Column(DataType.STRING(100))
  declare responsible_party: string | null; // e.g. 'Contractor', 'Electrician Rajesh', 'Client', 'Structural Engineer'

  @Column(DataType.DATEONLY)
  declare target_resolution_date: Date | null;

  @Default("Open")
  @Column(DataType.STRING(30))
  declare status: string; // typical: 'Open', 'In Progress', 'Resolved', 'Rejected', 'Reopened'

  // Photos – soft references (attachment can be deleted independently)
  @ForeignKey(() => Attachment)
  @Column(DataType.UUID)
  declare before_photo_id: string | null;

  @BelongsTo(() => Attachment, {
    foreignKey: "before_photo_id",
    as: "beforePhoto",
    constraints: false,
  })
  declare beforePhoto?: Attachment;

  @ForeignKey(() => Attachment)
  @Column(DataType.UUID)
  declare after_photo_id: string | null;

  @BelongsTo(() => Attachment, {
    foreignKey: "after_photo_id",
    as: "afterPhoto",
    constraints: false,
  })
  declare afterPhoto?: Attachment;

  @Column(DataType.DATE) // TIMESTAMPTZ → DATE (UTC)
  declare closed_at: Date | null;

  // Optional but very useful additions (common in real apps)
  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // Bonus: if you want to track who closed it
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare resolved_by: string | null;

  @BelongsTo(() => User, {
    foreignKey: "resolved_by",
    as: "resolvedBy",
  })
  declare resolvedBy?: User;
}
