// src/models/design-upload.model.ts
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

@Table({
  tableName: "design_uploads",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    // Common lookup patterns
    {
      fields: ["project_id"],
      name: "idx_design_uploads_project_id",
    },
    {
      fields: ["project_id", "design_type", "version"],
      unique: true, // prevents duplicate versions of same design type
      name: "uk_design_uploads_project_type_version",
    },
    {
      fields: ["uploaded_by"],
      name: "idx_design_uploads_uploaded_by",
    },
  ],
})
export class DesignUpload extends Model {
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
  declare design_type: string | null; // e.g. '3D Elevation', 'Floor Plan', 'Section', 'Master Bedroom Interior', etc.

  @Default(1)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare version: number;

  @Column(DataType.TEXT)
  declare description: string | null;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare uploaded_by: string | null;

  @BelongsTo(() => User, {
    foreignKey: "uploaded_by",
    as: "uploadedBy",
  })
  declare uploadedBy?: User;

  // Standard timestamps (not present in your original CREATE TABLE, but very useful)
  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}
