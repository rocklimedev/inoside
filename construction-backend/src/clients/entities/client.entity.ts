import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PreferredCommunication {
  CALL = 'Call',
  WHATSAPP = 'WhatsApp',
  EMAIL = 'Email',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 50 })
  contact_number!: string;

  @Column({ length: 255, unique: true, nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: PreferredCommunication,
    nullable: true,
  })
  preferred_communication?: PreferredCommunication;

  @Column({ type: 'boolean', default: true })
  is_owner!: boolean;

  @Column({ type: 'boolean', default: false })
  representative_involved!: boolean;

  @Column({ type: 'text', nullable: true })
  representative_comment?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
