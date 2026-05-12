import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Client } from '@/modules/clients/models/client.model';
import { Site } from '@/modules/sites/models/site.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare client_id: string;

  @ForeignKey(() => Site)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare site_id: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM('New Construction', 'Renovation', 'Interior Fit-out'),
    allowNull: false,
  })
  declare project_type: 'New Construction' | 'Renovation' | 'Interior Fit-out';

  @Column({
    type: DataType.ENUM('Construction', 'Interior', 'Renovation'),
    allowNull: true,
  })
  declare service_type: 'Construction' | 'Interior' | 'Renovation' | null;

  @Column({
    type: DataType.ENUM('Residential', 'Commercial', 'Mixed'),
    allowNull: true,
  })
  declare purpose: 'Residential' | 'Commercial' | 'Mixed' | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare number_of_floors: CreationOptional<number | null>;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare approximate_area_sqft: CreationOptional<number | null>;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare budget_range: CreationOptional<string | null>;

  @Column({
    type: DataType.ENUM('Immediate', 'Flexible', 'Fixed Date'),
    allowNull: true,
  })
  declare timeline_expectation: 'Immediate' | 'Flexible' | 'Fixed Date' | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare design_preference: CreationOptional<string | null>;

  @Column({
    type: DataType.ENUM(
      'brief',
      'pitch',
      'reki_pending',
      'reki_done',
      'scope_done',
      'boq_done',
      'design',
      'execution',
      'vendor_selection',
      'inventory',
      'quality',
      'handover',
      'completed',
    ),
    defaultValue: 'brief',
  })
  declare status: CreationOptional<
    | 'brief'
    | 'pitch'
    | 'reki_pending'
    | 'reki_done'
    | 'scope_done'
    | 'boq_done'
    | 'design'
    | 'execution'
    | 'vendor_selection'
    | 'inventory'
    | 'quality'
    | 'handover'
    | 'completed'
  >;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare current_stage: CreationOptional<string | null>;

  @Column({
    type: DataType.DECIMAL(5, 2),
    defaultValue: 0.0,
  })
  declare progress_percentage: CreationOptional<number>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare token_received: CreationOptional<boolean>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare created_by: CreationOptional<string | null>;

  // ================= RELATIONS =================

  @BelongsTo(() => Client)
  declare client?: NonAttribute<Client>;

  @BelongsTo(() => Site)
  declare site?: NonAttribute<Site>;

  @BelongsTo(() => User)
  declare creator?: NonAttribute<User>;
}
