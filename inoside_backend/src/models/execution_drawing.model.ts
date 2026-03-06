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
} from "sequelize-typescript";
import { Project } from "./project.model";
import { AttachmentEntityType } from "../types/db";

@Table({
  tableName: "execution_drawings",
  timestamps: false,
  indexes: [
    { fields: ["project_id"] },
    { unique: true, fields: ["project_id", "drawing_type", "version"] },
  ],
})
export class ExecutionDrawing extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare project_id: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AttachmentEntityType)))
  declare drawing_type: AttachmentEntityType;

  @Default(1)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare version: number;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare area_floor_ref: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null;

  @AllowNull(true)
  @Column(DataType.UUID)
  declare uploaded_by: string | null;

  @BelongsTo(() => Project)
  declare project?: Project;
}
