import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '@/projects/entities/project.entity';
import { Vendor } from './vendor.entity';

@Entity('vendor_quotations')
export class VendorQuotation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  project_id?: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ type: 'uuid', nullable: true })
  vendor_id?: string;

  @ManyToOne(() => Vendor, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vendor_id' })
  vendor?: Vendor;

  @Column({ length: 100, nullable: true })
  trade_category?: string;

  @Column({ type: 'jsonb', nullable: true })
  raw_quote_data?: Record<string, any>;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  total_amount?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  submitted_at!: Date;
}
