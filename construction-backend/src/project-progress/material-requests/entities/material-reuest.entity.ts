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
import { User } from '@/users/entities/user.entity';

@Entity('material_requests')
export class MaterialRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { nullable: true })
  project_id?: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column()
  material_name!: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  quantity_required!: number;

  @Column()
  unit!: string;

  @Column({ type: 'date', nullable: true })
  required_by_date?: Date;

  @Column('uuid', { nullable: true })
  requested_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'requested_by' })
  requester?: User;

  @Column({ default: 'Pending' })
  status!: string; // Pending, Approved, Rejected, Ordered, Received, Cancelled

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
