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

@Entity('execution_drawings')
export class ExecutionDrawing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ length: 50 })
  drawing_type!: string; // e.g., 'foundation', 'slab', 'plumbing', etc.

  @Column({ default: 1 })
  version!: number;

  @Column({ length: 100, nullable: true })
  area_floor_ref?: string; // e.g., 'Ground Floor', 'Block A - 2nd Floor'

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
