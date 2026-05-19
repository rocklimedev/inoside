import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

import type { CreationOptional } from 'sequelize';
import { Project } from '../../projects/models/project.model';
import { Material } from './materials.model';
import { Vendor } from '../../vendors/models/vendor.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'inventory_requests',
  timestamps: false,
})
export class InventoryRequest extends Model<
  InferAttributes<InventoryRequest>,
  InferCreationAttributes<InventoryRequest>
> {
  @PrimaryKey
  @Column({
    type: DataType.CHAR(36),
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.CHAR(36),
    allowNull: false,
  })
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project?: Project;

  @ForeignKey(() => Material)
  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
  })
  declare material_id?: string;

  @BelongsTo(() => Material)
  declare material?: Material;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare quantity_required: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare required_date?: string;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
  })
  declare vendor_id?: string;

  @BelongsTo(() => Vendor)
  declare vendor?: Vendor;

  @Column({
    type: DataType.ENUM('Vendor', 'Warehouse'),
    allowNull: false,
  })
  declare source_type: 'Vendor' | 'Warehouse';

  @Default('requested')
  @Column({
    type: DataType.ENUM('requested', 'approved', 'dispatched', 'delivered'),
    allowNull: false,
  })
  declare status: 'requested' | 'approved' | 'dispatched' | 'delivered';

  @ForeignKey(() => User)
  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
  })
  declare requested_by?: string;

  @BelongsTo(() => User, 'requested_by')
  declare requester?: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
  })
  declare approved_by?: string;

  @BelongsTo(() => User, 'approved_by')
  declare approver?: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare created_at: CreationOptional<Date>;
}
