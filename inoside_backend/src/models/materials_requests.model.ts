// src/models/material-request.model.ts
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
  tableName: "material_requests",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false, // no updated_at in original schema
  indexes: [
    {
      fields: ["project_id"],
      name: "idx_material_requests_project_id",
    },
    {
      fields: ["project_id", "status"],
      name: "idx_material_requests_project_status",
    },
    {
      fields: ["required_by_date"],
      name: "idx_material_requests_required_by_date",
    },
    {
      fields: ["requested_by"],
      name: "idx_material_requests_requested_by",
    },
  ],
})
export class MaterialRequest extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string | null;

  @BelongsTo(() => Project, {
    foreignKey: "project_id",
    onDelete: "CASCADE",
  })
  declare project?: Project;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare material_name: string;

  @Column(DataType.STRING(100))
  declare category: string | null; // e.g. 'Cement', 'Electrical', 'Sanitary', 'Finishing', 'Structural Steel'

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare quantity_required: number | null;

  @Column(DataType.STRING(20))
  declare unit: string | null; // e.g. 'Bags', 'Kg', 'Nos', 'Sqm', 'Cum'

  @Column(DataType.DATEONLY)
  declare required_by_date: Date | null;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare requested_by: string | null;

  @BelongsTo(() => User, {
    foreignKey: "requested_by",
    as: "requestedBy",
  })
  declare requestedBy?: User;

  @Default("Pending")
  @Column(DataType.STRING(30))
  declare status: string; // common values: 'Pending', 'Approved', 'Ordered', 'Received', 'Rejected', 'Partial'

  @CreatedAt
  @Default(DataType.NOW)
  declare created_at: Date;
}
