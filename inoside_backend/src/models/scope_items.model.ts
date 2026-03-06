// src/models/scope-item.model.ts
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
  Index,
} from "sequelize-typescript";
import { ProjectScope } from "./project_scope.model";
@Table({
  tableName: "scope_items",
  timestamps: false, // no created_at / updated_at in your original schema
  indexes: [
    {
      fields: ["scope_id"],
      name: "idx_scope_items_scope_id",
    },
    {
      fields: ["category"],
      name: "idx_scope_items_category",
    },
    {
      fields: ["scope_id", "category", "sub_item"],
      unique: true, // prevents duplicate sub-items in the same category under one scope
      name: "uk_scope_items_scope_category_subitem",
    },
  ],
})
export class ScopeItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => ProjectScope)
  @Column(DataType.UUID)
  declare scope_id: string;

  @BelongsTo(() => ProjectScope, {
    foreignKey: "scope_id",
    onDelete: "CASCADE",
    as: "scope",
  })
  declare scope?: ProjectScope;

  @Column(DataType.STRING(100))
  declare category: string | null; // e.g. 'Civil', 'Plumbing', 'Electrical', 'Finishes', 'Furniture', 'False Ceiling'

  @Column(DataType.STRING(150))
  declare sub_item: string | null; // e.g. 'RCC Columns & Beams', 'CPVC Piping', 'Wardrobe - Master Bedroom'

  @Column(DataType.TEXT)
  declare description: string | null; // detailed scope / specification / notes
}
