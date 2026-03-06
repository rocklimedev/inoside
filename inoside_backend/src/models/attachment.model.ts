// src/models/attachment.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  CreatedAt,
  ForeignKey,
  BelongsTo,
  Index,
} from "sequelize-typescript";
import { User } from "./user.model";
// ── Enums (you can also put these in a central types file) ────────────────
export const ATTACHMENT_ENTITY_TYPES = [
  "reki_photo",
  "moodboard",
  "pitch_ref",
  "design_upload",
  "execution_drawing",
  "daily_photo",
  "boq",
  "handover_pdf",
  "drawings_zip",
  "issue_before",
  "issue_after",
  "etc",
] as const;

export type AttachmentEntityType = (typeof ATTACHMENT_ENTITY_TYPES)[number];

export const FILE_TYPES = ["image", "pdf", "zip", "doc", "other"] as const;

export type FileTypeEnum = (typeof FILE_TYPES)[number];

// ────────────────────────────────────────────────────────────────────────────

@Table({
  tableName: "attachments",
  timestamps: true,
  createdAt: "uploaded_at", // we're using uploaded_at as created_at
  updatedAt: false, // no updated_at column in original schema
  indexes: [
    {
      name: "idx_attachments_entity",
      fields: ["entity_type", "entity_id"],
    },
    {
      name: "idx_attachments_uploader",
      fields: ["uploaded_by"],
    },
  ],
})
export class Attachment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  // ── Polymorphic reference ───────────────────────────────────────────────
  @AllowNull(false)
  @Column(DataType.ENUM(...ATTACHMENT_ENTITY_TYPES))
  declare entity_type: AttachmentEntityType;

  @AllowNull(false)
  @Column(DataType.UUID)
  declare entity_id: string;

  // ── File information ────────────────────────────────────────────────────
  @AllowNull(false)
  @Column(DataType.TEXT)
  declare file_path: string; // usually S3 key, cloud storage path, etc.

  @AllowNull(false)
  @Column(DataType.ENUM(...FILE_TYPES))
  declare file_type: FileTypeEnum;

  // ── Who uploaded it ─────────────────────────────────────────────────────
  @ForeignKey(() => User) // assuming you have a User model
  @Column(DataType.UUID)
  declare uploaded_by: string | null;

  @BelongsTo(() => User, {
    foreignKey: "uploaded_by",
    as: "uploader",
  })
  declare uploader?: User; // optional relation

  // ── Timestamp ───────────────────────────────────────────────────────────
  @CreatedAt
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  declare uploaded_at: Date;
}
