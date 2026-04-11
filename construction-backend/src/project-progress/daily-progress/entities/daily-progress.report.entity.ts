import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';

@Entity('daily_progress_reports')
export class DailyProgressReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ type: 'date' })
  report_date!: Date;

  @Column({ nullable: true })
  current_stage?: string;

  @Column('text', { nullable: true })
  work_executed?: string;

  @Column({ nullable: true })
  manpower_count?: number;

  @Column({ type: 'jsonb', nullable: true })
  materials_used?: Record<string, any>;

  @Column('text', { nullable: true })
  issues_faced?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  completion_percent_today?: number;

  @Column('uuid', { nullable: true })
  created_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator?: User;

  @CreateDateColumn()
  created_at!: Date;
}
