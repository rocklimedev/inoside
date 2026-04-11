// src/projects/entities/scope-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectScope } from './project-scopes.entity';

@Entity('scope_items')
export class ScopeItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  scope_id!: string;

  @ManyToOne(() => ProjectScope, (scope) => scope.scope_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scope_id' })
  scope!: ProjectScope;

  @Column({ length: 100 })
  category!: string;

  @Column({ length: 150, nullable: true })
  sub_item?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
