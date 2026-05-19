import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'cdn_files',
  timestamps: true,
})
export class CdnFile extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  original_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  filename!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  size!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mime_type!: string;
}
