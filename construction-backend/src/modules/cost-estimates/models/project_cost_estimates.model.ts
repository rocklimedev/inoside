import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { Project } from '@/modules/projects/models/project.model';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

export interface EstimateItem {
  title: string;
  description: string;
  price?: number | null; // ✅ Added
}

export interface PaymentPlanItem {
  title: string;
  description: string;
  amount?: number | null; // ✅ Added (better name for payment)
}

@Table({
  tableName: 'project_cost_estimates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProjectCostEstimate extends Model<
  InferAttributes<ProjectCostEstimate>,
  InferCreationAttributes<ProjectCostEstimate>
> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  declare project_id: string;

  @Column(DataType.ENUM('Consultation', 'Turnkey', 'Constructional'))
  declare estimate_type: 'Consultation' | 'Turnkey' | 'Constructional';

  @Column(DataType.DECIMAL(12, 2))
  declare consultation_fee: number;

  @Column(DataType.DECIMAL(15, 2))
  declare tentative_total_cost: number;

  @Column(DataType.JSON)
  declare material_labour_estimate: EstimateItem[];

  @Column(DataType.JSON)
  declare payment_plan: PaymentPlanItem[];

  @Column(DataType.STRING)
  declare annexure_url: string;

  @Column(DataType.STRING)
  declare contract_url: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;
}
