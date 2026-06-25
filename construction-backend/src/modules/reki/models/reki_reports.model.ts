import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  HasMany,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { RekiPhoto } from './reki_photos.model';

@Table({
  tableName: 'reki_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class RekiReport extends Model<
  InferAttributes<RekiReport>,
  InferCreationAttributes<RekiReport>
> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  // ======================================================
  // RELATIONS
  // ======================================================

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare project_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  declare supervisor_id: string;

  // ======================================================
  // REKI DATA
  // ======================================================

  @Column(DataType.DATEONLY)
  declare visit_date: string;

  @Column(DataType.BOOLEAN)
  declare client_present: boolean;

  @Column(DataType.BOOLEAN)
  declare road_access: boolean;

  @Column(DataType.BOOLEAN)
  declare unloading_space: boolean;

  @Column(DataType.STRING)
  declare area_type: string;

  @Column(DataType.BOOLEAN)
  declare neighbouring_buildings: boolean;

  @Column(DataType.TEXT)
  declare working_time_restrictions: string;

  @Column(DataType.STRING)
  declare plot_type: string;

  @Column(DataType.BOOLEAN)
  declare existing_structure: boolean;

  @Column(DataType.STRING)
  declare construction_type: string;

  @Column(DataType.INTEGER)
  declare existing_floors: number;

  @Column(DataType.BOOLEAN)
  declare structural_cracks: boolean;

  @Column(DataType.DECIMAL(12, 2))
  declare built_up_area: number;

  @Column(DataType.DECIMAL(6, 2))
  declare floor_to_floor_height: number;

  @Column(DataType.DECIMAL(6, 2))
  declare slab_thickness: number;

  @Column(DataType.BOOLEAN)
  declare columns_beams_visible: boolean;

  @Column(DataType.STRING)
  declare wall_condition: string;

  @Column(DataType.STRING)
  declare floor_condition: string;

  @Column(DataType.BOOLEAN)
  declare dampness: boolean;

  @Column(DataType.TEXT)
  declare dampness_location: string;

  @Column(DataType.BOOLEAN)
  declare termite_damage: boolean;

  @Column(DataType.BOOLEAN)
  declare electrical_wiring: boolean;

  @Column(DataType.TEXT)
  declare electrical_panel_location: string;

  @Column(DataType.BOOLEAN)
  declare plumbing_lines: boolean;

  @Column(DataType.TEXT)
  declare water_inlet_outlet: string;

  @Column(DataType.BOOLEAN)
  declare tanks_present: boolean;

  @Column(DataType.BOOLEAN)
  declare demolition_required: boolean;

  @Column(DataType.STRING)
  declare demolition_type: string;

  @Column(DataType.BOOLEAN)
  declare safety_concerns: boolean;

  @Column(DataType.STRING)
  declare load_bearing_changes: string;

  @Column(DataType.BOOLEAN)
  declare beam_cutting: boolean;

  @Column(DataType.BOOLEAN)
  declare core_drilling: boolean;

  @Column(DataType.BOOLEAN)
  declare structural_consultant_required: boolean;

  @Column(DataType.TEXT)
  declare major_constraints: string;

  @Column(DataType.TEXT)
  declare risk_factors: string;

  @Column(DataType.TEXT)
  declare suggestions: string;

  @Column(DataType.TEXT)
  declare client_instructions: string;

  @Column(DataType.STRING)
  declare reki_pdf_url: string;

  // ======================================================
  // ASSOCIATIONS
  // ======================================================

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @BelongsTo(() => User)
  declare supervisor?: NonAttribute<User>;

  // ✅ IMPORTANT: Add this association
  @HasMany(() => RekiPhoto)
  declare rekiPhotos?: NonAttribute<RekiPhoto[]>;
}
