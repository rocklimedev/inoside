// src/projects/entities/site-reki-report.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '@/users/entities/user.entity';

@Entity('site_reki_report')
export class SiteRekiReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ type: 'date', nullable: true })
  visit_date?: Date;

  @Column({ type: 'uuid', nullable: true })
  supervisor_id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor?: User;

  @Column({ default: false })
  client_present!: boolean;

  // Site Conditions
  @Column({ default: false })
  road_access!: boolean;

  @Column({ default: false })
  unloading_space!: boolean;

  @Column({ length: 100, nullable: true })
  plot_type?: string;

  @Column({ length: 100, nullable: true })
  construction_type?: string;

  @Column({ default: false })
  cracks!: boolean;

  @Column({ default: false })
  dampness!: boolean;

  @Column({ default: false })
  termite!: boolean;

  @Column({ default: false })
  electrical_wiring!: boolean;

  @Column({ default: false })
  demolition_required!: boolean;

  @Column({ default: false })
  load_bearing_changes!: boolean;

  @Column({ default: false })
  power_supply!: boolean;

  // Text fields
  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'text', nullable: true })
  major_constraints?: string;

  @Column({ type: 'text', nullable: true })
  risk_factors?: string;

  @Column({ type: 'text', nullable: true })
  suggestions?: string;

  @Column({ type: 'text', nullable: true })
  client_instructions?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  completed_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}
