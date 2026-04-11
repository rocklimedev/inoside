import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OwnershipStatus {
  OWNED = 'Owned',
  RENTED = 'Rented',
  UNDER_PROCESS = 'Under Process',
}

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'text' })
  address!: string;

  @Column({ length: 100 })
  city!: string;

  @Column({
    type: 'enum',
    enum: OwnershipStatus,
    nullable: true,
  })
  ownership_status?: OwnershipStatus;

  @Column({ type: 'boolean', nullable: true })
  access_available?: boolean;

  @Column({ type: 'boolean', nullable: true })
  existing_structure?: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
