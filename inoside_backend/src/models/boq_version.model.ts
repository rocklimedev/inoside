import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  CreatedAt,
} from "sequelize-typescript";
import { Project } from "./project.model";

@Table({
  tableName: "boq_versions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
  indexes: [
    { fields: ["project_id"] },
    { unique: true, fields: ["project_id", "version"] },
  ],
})
export class BoqVersion extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @Default(1)
  @Column(DataType.INTEGER)
  declare version: number;

  @Column(DataType.UUID)
  declare prepared_by: string | null;

  @Column(DataType.DATEONLY)
  declare prepared_date: Date | null;

  @Column(DataType.DECIMAL(15, 2))
  declare grand_total: number | null;

  @Column(DataType.TEXT)
  declare notes: string | null;

  @CreatedAt
  declare created_at: Date;
}
