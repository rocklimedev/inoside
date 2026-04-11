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

@Entity('design_uploads')
export class DesignUpload {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ length: 100, nullable: true })
  design_type?: string; // e.g., 'architectural', 'structural', 'electrical', etc.

  @Column({ default: 1 })
  version!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  uploaded_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploader?: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
