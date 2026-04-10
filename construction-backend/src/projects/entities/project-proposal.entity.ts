// project-proposal.entity.ts
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

import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';

export enum ProposalTypeEnum {
  BASIC = 'BASIC',
  DETAILED = 'DETAILED',
  CUSTOM = 'CUSTOM',
}

@Entity('project_proposals')
export class ProjectProposal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 🔗 Project (1:1)
  @Column({ type: 'uuid', unique: true })
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ type: 'enum', enum: ProposalTypeEnum })
  proposal_type!: ProposalTypeEnum;

  @Column({ type: 'text', nullable: true })
  scope_summary?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // 👤 Prepared by
  @Column({ type: 'uuid', nullable: true })
  prepared_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'prepared_by' })
  preparer?: User;

  // ⏱ Time & cost
  @Column({ type: 'interval', nullable: true })
  time_involvement_estimate?: any; // ⚠️ interval → string in TS

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  consultation_fee?: string;

  @Column({ type: 'int', nullable: true })
  duration_months?: number;

  // 📦 JSON fields
  @Column({ type: 'jsonb', nullable: true })
  deliverables?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  terms_limitations?: string;

  @Column({ type: 'jsonb', nullable: true })
  material_labour_estimate?: Record<string, any>;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  tentative_cost_estimate?: string;

  @Column({ type: 'jsonb', nullable: true })
  payment_plan_stages?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  annexure_specs?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  buyer_payment_plan?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  contract_template?: string;

  @Column({ length: 255, nullable: true })
  buyer_name?: string;

  @Column({ default: false })
  signed_by_client!: boolean;

  @Column({ default: false })
  signed_by_builder!: boolean;

  // 🕒 timestamps
  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  // 🔒 optimistic locking
  @VersionColumn()
  lock_version!: number;
}
