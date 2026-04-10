import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 100, unique: true, nullable: false })
  name!: string;

  @Column({ length: 50, nullable: false })
  module!: string;

  @Column({ length: 50, nullable: false })
  action!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions!: RolePermission[];

  @CreateDateColumn()
  created_at!: Date;
}
