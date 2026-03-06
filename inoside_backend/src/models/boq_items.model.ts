// src/models/boq-item.model.ts
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
  BeforeSave,
} from "sequelize-typescript";
import { BoqVersion } from "./boq_version.model";
@Table({
  tableName: "boq_items",
  timestamps: false, // no created_at / updated_at in your original table
  indexes: [
    {
      fields: ["boq_id"],
      name: "idx_boq_items_boq_id",
    },
    {
      fields: ["category"],
      name: "idx_boq_items_category",
    },
  ],
})
export class BoqItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => BoqVersion)
  @Column(DataType.UUID)
  declare boq_id: string;

  @BelongsTo(() => BoqVersion, {
    foreignKey: "boq_id",
    onDelete: "CASCADE",
  })
  declare boqVersion?: BoqVersion;

  @Column(DataType.STRING(100))
  declare category: string | null;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare item_name: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare quantity: number;

  @Column(DataType.STRING(20))
  declare unit: string | null;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  declare rate: number | null;

  // ── Computed field (not stored in DB) ───────────────────────────────
  // Option A: Virtual field (calculated when reading)
  @Column({
    type: DataType.VIRTUAL,
    get() {
      const qty = this.getDataValue("quantity");
      const rate = this.getDataValue("rate");
      if (qty == null || rate == null) return null;
      return Number((qty * rate).toFixed(2));
    },
  })
  declare amount: number | null;

  // Option B: Store amount in DB (recommended for reporting / sorting)
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: "amount", // maps to the column name
  })
  declare _amount: number | null; // private field

  @Column(DataType.JSON)
  declare specifications: any | null; // MySQL → JSON

  @Column(DataType.TEXT)
  declare remarks: string | null;

  // ── Automatically calculate and store amount before save ─────────────
  @BeforeSave
  static calculateAmount(instance: BoqItem) {
    if (instance.quantity != null && instance.rate != null) {
      instance._amount = Number((instance.quantity * instance.rate).toFixed(2));
    } else {
      instance._amount = null;
    }
  }
}
