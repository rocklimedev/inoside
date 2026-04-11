// src/projects/entities/project-scopes.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { ScopeItem } from './scope-item.entity';
@Entity('project_scopes')
export class ProjectScope {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  project_id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ length: 100, nullable: true })
  service_type?: string;

  @Column({ type: 'text', nullable: true })
  requirements_summary?: string;

  @Column({ type: 'text', nullable: true })
  site_summary?: string;

  @OneToMany(() => ScopeItem, (item) => item.scope, { cascade: true })
  scope_items!: ScopeItem[];
}
