import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Address } from '../../users/entities/address.entity';
import {
  ProjectType,
  ProjectPurpose,
  DesignPreference,
  DecisionReadiness,
  ColorTone,
  LuxuryLevel,
} from '../../common/enums/project.enums';

client: User;
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  client_user_id!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'client_user_id' })
  client!: User | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'enum', enum: ProjectType, nullable: true })
  project_type!: ProjectType | null;

  @Column({ type: 'enum', enum: ProjectPurpose, nullable: true })
  purpose!: ProjectPurpose | null;

  // ✅ FIXED
  @Column({ type: 'int', nullable: true })
  num_floors!: number | null;

  // ⚠️ Postgres returns decimal as string
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  approx_area!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  budget_range!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timeline_expectation!: string | null;

  @Column({ type: 'enum', enum: DesignPreference, nullable: true })
  design_preference!: DesignPreference | null;

  // ✅ Explicit boolean
  @Column({ type: 'boolean', default: true })
  is_first_project!: boolean;

  @Column({ type: 'enum', enum: DecisionReadiness, nullable: true })
  decision_readiness!: DecisionReadiness | null;

  @Column({ type: 'boolean', default: false })
  worked_with_before!: boolean;

  @Column({ type: 'boolean', default: true })
  end_to_end!: boolean;

  @Column({ type: 'varchar', length: 30, default: 'brief' })
  status!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  current_stage!: string | null;

  // ⚠️ decimal → string
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overall_completion!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  preferred_style!: string | null;

  @Column({ type: 'enum', enum: ColorTone, nullable: true })
  color_tone!: ColorTone | null;

  @Column({ type: 'enum', enum: LuxuryLevel, nullable: true })
  luxury_level!: LuxuryLevel | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  func_vs_aesth!: string | null;

  @Column({ type: 'boolean', default: true })
  budget_flexible!: boolean;

  // ✅ Use jsonb in Postgres
  @Column({ type: 'jsonb', nullable: true })
  priority_areas!: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  likes_dislikes!: string | null;

  @Column({ type: 'text', nullable: true })
  non_negotiables!: string | null;

  @Column({ type: 'text', nullable: true })
  special_req!: string | null;

  @Column({ type: 'uuid', nullable: true })
  primary_site_address_id!: string | null;

  @ManyToOne(() => Address, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'primary_site_address_id' })
  primary_site_address!: Address | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @VersionColumn({ type: 'int', default: 0 })
  lock_version!: number;
}
