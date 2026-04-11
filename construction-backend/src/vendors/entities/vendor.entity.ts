import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  OneToMany,
} from 'typeorm';
import { Address } from '@/users/entities/address.entity';
import { VendorQuotation } from './vendor-quotation.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 100, nullable: true })
  trade_type?: string; // e.g., 'Electrical', 'Plumbing', 'Civil', etc.

  @Column({ length: 100, nullable: true })
  contact_person?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'uuid', nullable: true })
  primary_address_id?: string;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'primary_address_id' })
  primary_address?: Address;

  @Column({ type: 'int', nullable: true })
  rating?: number;
  @Column({ type: 'jsonb', nullable: true })
  past_performance?: Record<string, any>;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @VersionColumn()
  lock_version!: number;

  @OneToMany(() => VendorQuotation, (q) => q.vendor)
  quotations!: VendorQuotation[];
}
