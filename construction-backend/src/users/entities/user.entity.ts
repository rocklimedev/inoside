import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { PreferredComm } from '../../common/enums';
import { Role } from '../../rbac/entities/role.entity'; // ✅ import Role

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: false })
  full_name!: string;

  @Column({ length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  // ✅ REPLACE enum with relation
  @ManyToOne(() => Role, { eager: true }) // eager optional
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({ type: 'enum', enum: PreferredComm, default: PreferredComm.EMAIL })
  preferred_comm!: PreferredComm;

  @Column({ nullable: false })
  password_hash!: string;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ type: 'uuid', nullable: true })
  primary_address_id?: string;

  @OneToOne(() => Address, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'primary_address_id' })
  primary_address?: Address;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @VersionColumn({ default: 0 })
  lock_version!: number;
}
