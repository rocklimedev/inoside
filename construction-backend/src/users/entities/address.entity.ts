import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { AddressType } from '../../common/enums';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, nullable: false })
  entity_type!: string;

  @Column({ type: 'uuid', nullable: false })
  entity_id!: string;

  @Column({ length: 255, nullable: false })
  line1!: string;

  @Column({ length: 255, nullable: true })
  line2?: string;

  @Column({ length: 150, nullable: true })
  landmark?: string;

  @Column({ length: 150, nullable: true })
  locality_area?: string;

  @Column({ length: 100, nullable: false })
  city!: string;

  @Column({ length: 100, nullable: true })
  state_province?: string;

  @Column({ length: 20, nullable: true })
  postal_code?: string;

  @Column({ length: 100, default: 'India' })
  country!: string;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.PROJECT_SITE,
  })
  address_type!: AddressType;

  @Column({ default: true })
  is_primary!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @VersionColumn({ default: 0 })
  lock_version!: number;
}
