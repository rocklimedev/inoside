// attachments.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
export enum AttachmentEntityType {
  USER = 'USER',
  PROJECT = 'PROJECT',
  TASK = 'TASK',
}

export enum FileTypeEnum {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  DOC = 'DOC',
  OTHER = 'OTHER',
}

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: AttachmentEntityType })
  entity_type!: AttachmentEntityType;

  @Column('uuid')
  entity_id!: string;

  @Column('text')
  file_path!: string;

  @Column({ type: 'enum', enum: FileTypeEnum })
  file_type!: FileTypeEnum;

  @Column({ type: 'uuid', nullable: true })
  uploaded_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploader?: User;

  @CreateDateColumn({ type: 'timestamptz' })
  uploaded_at!: Date;
}
