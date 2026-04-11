import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BoqVersion } from './boq-version.entity';

@Entity('boq_items')
export class BoqItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  boq_id!: string;

  @ManyToOne(() => BoqVersion, (boq) => boq.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boq_id' })
  boq!: BoqVersion;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ type: 'text' })
  item_name!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  quantity!: string;

  @Column({ length: 20, nullable: true })
  unit?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  rate?: string | null;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amount!: string; // GENERATED ALWAYS AS (quantity * rate) STORED in DB

  @Column({ type: 'jsonb', nullable: true })
  specifications?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  remarks?: string;
}
