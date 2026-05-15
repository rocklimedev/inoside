import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { RekiReport } from './reki_reports.model';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
@Table({
  tableName: 'reki_photos',
  timestamps: false,
})
export class RekiPhoto extends Model<
  InferAttributes<RekiPhoto>,
  InferCreationAttributes<RekiPhoto>
> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: CreationOptional<string>;

  @ForeignKey(() => RekiReport)
  @Column(DataType.UUID)
  declare reki_report_id: string;

  @Column(DataType.STRING)
  declare photo_type: string;

  @Column(DataType.STRING)
  declare photo_url: string;

  @BelongsTo(() => RekiReport)
  declare report?: NonAttribute<RekiReport>;
}
