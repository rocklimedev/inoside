import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'materials',
  timestamps: false,
})
export class Material extends Model<Material> {
  @PrimaryKey
  @Column({
    type: DataType.CHAR(36),
  })
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare category: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare created_at: Date;
}
