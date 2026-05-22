import { Table, Column, Model, DataType } from 'sequelize-typescript';

import type { CreationOptional } from 'sequelize';

@Table({
  tableName: 'addresses',

  timestamps: true,

  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Address extends Model {
  @Column({
    type: DataType.UUID,

    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,

    allowNull: false,
  })
  declare line1: string;

  @Column({
    type: DataType.STRING,

    allowNull: true,
  })
  declare line2: CreationOptional<string>;

  @Column({
    type: DataType.STRING,

    allowNull: true,
  })
  declare landmark: CreationOptional<string>;

  @Column({
    type: DataType.STRING,

    allowNull: false,
  })
  declare city: string;

  @Column({
    type: DataType.STRING,

    allowNull: true,
  })
  declare state: CreationOptional<string>;

  @Column({
    type: DataType.STRING,

    allowNull: true,

    defaultValue: 'India',
  })
  declare country: CreationOptional<string>;

  @Column({
    type: DataType.STRING,

    allowNull: true,
  })
  declare pincode: CreationOptional<string>;

  @Column({
    type: DataType.DECIMAL(10, 8),

    allowNull: true,
  })
  declare latitude: CreationOptional<number>;

  @Column({
    type: DataType.DECIMAL(11, 8),

    allowNull: true,
  })
  declare longitude: CreationOptional<number>;

  @Column({
    type: DataType.TEXT,

    allowNull: true,
  })
  declare google_map_link: CreationOptional<string>;

  @Column(DataType.DATE)
  declare created_at: CreationOptional<Date>;

  @Column(DataType.DATE)
  declare updated_at: CreationOptional<Date>;
}
