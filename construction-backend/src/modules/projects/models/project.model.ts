import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  HasOne,
  HasMany,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Client } from '@/modules/clients/models/client.model';
import { Site } from '@/modules/sites/models/site.model';
import { User } from '@/modules/users/models/user.model';
import { ProjectBrief } from './project_brief.model';
import { PitchReference } from './pitch_references.model';
import { ProjectPitch } from './project_pitch.model';
import { RekiReport } from './reki_reports.model';
import { RekiPhoto } from './reki_photos.model';
import { ScopeOfWork } from './scope_of_work.model';
import { ProjectCostEstimate } from './project_cost_estimates.model';
import { ProjectDrawing } from './project-drawings.model';

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
  // ======================================================
  // PRIMARY KEY
  // ======================================================

  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  // ======================================================
  // RELATIONS
  // ======================================================

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare created_by: CreationOptional<string | null>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare assigned_to: CreationOptional<string | null>;

  // ======================================================
  // BASIC DETAILS
  // ======================================================

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: CreationOptional<string | null>;

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
  declare number_of_floors: CreationOptional<number> | null;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare approximate_area_sqft: CreationOptional<number> | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare budget_range: CreationOptional<string> | null;

  @Column({
    type: DataType.ENUM('Immediate', 'Flexible', 'Fixed Date'),
    allowNull: true,
  })
  declare timeline_expectation: 'Immediate' | 'Flexible' | 'Fixed Date' | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare design_preference: CreationOptional<string> | null;

  // ======================================================
  // PROJECT STATUS
  // ======================================================

  @Default('brief')
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
      'cancelled',
      'on_hold',
    ),
    allowNull: false,
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
    | 'cancelled'
    | 'on_hold'
  >;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare current_stage: CreationOptional<string> | null;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare progress_percentage: CreationOptional<number>;

  // ======================================================
  // BUSINESS FLAGS
  // ======================================================

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare token_received: CreationOptional<boolean>;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare is_archived: CreationOptional<boolean>;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare is_completed: CreationOptional<boolean>;

  // ======================================================
  // DATES
  // ======================================================

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare estimated_start_date: CreationOptional<Date> | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare estimated_end_date: CreationOptional<Date> | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare actual_start_date: CreationOptional<Date> | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare actual_end_date: CreationOptional<Date> | null;

  // ======================================================
  // FINANCIALS
  // ======================================================

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  declare estimated_budget: CreationOptional<number> | null;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  declare final_budget: CreationOptional<number> | null;

  // ======================================================
  // RELATIONS
  // ======================================================

  @BelongsTo(() => Client)
  declare client?: NonAttribute<Client>;

  @BelongsTo(() => Site)
  declare site?: NonAttribute<Site>;

  @BelongsTo(() => User, 'created_by')
  declare creator?: NonAttribute<User>;

  @BelongsTo(() => User, 'assigned_to')
  declare assignedUser?: NonAttribute<User>;

  // ======================================================
  // MODULE RELATIONS
  // ======================================================

  @HasOne(() => ProjectBrief)
  declare brief?: NonAttribute<ProjectBrief>;

  @HasOne(() => ProjectPitch)
  declare pitch?: NonAttribute<ProjectPitch>;

  @HasOne(() => RekiReport)
  declare reki?: NonAttribute<RekiReport>;

  @HasOne(() => ScopeOfWork)
  declare scope?: NonAttribute<ScopeOfWork>;

  @HasMany(() => PitchReference)
  declare pitchReferences?: NonAttribute<PitchReference[]>;

  @HasMany(() => ProjectCostEstimate)
  declare costEstimates?: NonAttribute<ProjectCostEstimate[]>;

  @HasMany(() => ProjectDrawing)
  declare drawings?: NonAttribute<ProjectDrawing[]>;
}
