import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '@/projects/entities/project.entity';
import { Attachment } from '@/attachments/entities/attachments.entity';

@Entity('project_issues')
export class ProjectIssue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column('text')
  issue_description!: string;

  @Column()
  responsible_party!: string;

  @Column({ type: 'date', nullable: true })
  target_resolution_date?: Date;

  @Column({ default: 'Open' })
  status!: string; // Open, In Progress, Resolved, Closed

  @Column('uuid', { nullable: true })
  before_photo_id?: string;

  @ManyToOne(() => Attachment, { nullable: true })
  @JoinColumn({ name: 'before_photo_id' })
  beforePhoto?: Attachment;

  @Column('uuid', { nullable: true })
  after_photo_id?: string;

  @ManyToOne(() => Attachment, { nullable: true })
  @JoinColumn({ name: 'after_photo_id' })
  afterPhoto?: Attachment;

  @Column({ type: 'timestamptz', nullable: true })
  closed_at?: Date | null; // or: closed_at: Date | null | undefined;
  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
