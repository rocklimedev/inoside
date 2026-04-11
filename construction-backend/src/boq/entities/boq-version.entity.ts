import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Unique,
} from 'typeorm';
import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { BoqItem } from './boq-item.entity';

@Entity('boq_versions')
@Unique(['project_id', 'version']) // Prevent duplicate versions for same project
export class BoqVersion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ default: 1 })
  version!: number;

  @Column({ type: 'uuid', nullable: true })
  prepared_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'prepared_by' })
  preparer?: User;

  @Column({ type: 'date', nullable: true })
  prepared_date?: Date;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  grand_total?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  // Optimistic locking (recommended for BOQ)
  @VersionColumn()
  lock_version!: number;

  @OneToMany(() => BoqItem, (item) => item.boq, {
    cascade: true,
    eager: false,
  })
  items!: BoqItem[];
}
