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

@Entity('stage_quality_checks')
export class StageQualityCheck {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ type: 'varchar' })
  stage_name!: string;

  @Column({ type: 'boolean' })
  quality_met!: boolean;

  @Column({ type: 'boolean' })
  deviations!: boolean;

  @Column('text', { nullable: true })
  corrective_action?: string;

  @Column('text', { nullable: true })
  supervisor_remarks?: string;

  @Column('uuid', { nullable: true })
  checked_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'checked_by' })
  checker?: User;

  @CreateDateColumn()
  checked_at!: Date;
}
