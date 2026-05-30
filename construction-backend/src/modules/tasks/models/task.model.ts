import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';

@Table({
  tableName: 'team_tasks',

  timestamps: true,

  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
> {
  // ======================================================
  // PRIMARY KEY
  // ======================================================

  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  // ======================================================
  // PROJECT
  // ======================================================

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare project_id: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  // ======================================================
  // CREATED BY
  // ======================================================

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare created_by_user_id: string;

  @BelongsTo(() => User, {
    foreignKey: 'created_by_user_id',
    as: 'createdBy',
  })
  declare createdBy?: NonAttribute<User>;

  // ======================================================
  // ASSIGNED USER
  // ======================================================

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare assigned_to_user_id: CreationOptional<string | null>;

  @BelongsTo(() => User, {
    foreignKey: 'assigned_to_user_id',
    as: 'assignedUser',
  })
  declare assignedUser?: NonAttribute<User>;

  // ======================================================
  // TASK DETAILS
  // ======================================================

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare module: CreationOptional<string | null>;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare due_date: CreationOptional<string | null>;

  @Default('medium')
  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'urgent'),
  })
  declare priority: CreationOptional<'low' | 'medium' | 'high' | 'urgent'>;

  @Default('General')
  @Column({
    type: DataType.ENUM(
      'General',
      'Design upload',
      'Revision response',
      'Site visit',
      'Vendor follow-up',
      'Inventory dispatch',
      'Quality check',
      'Client response',
      'Internal documentation',
    ),
  })
  declare task_type: CreationOptional<
    | 'General'
    | 'Design upload'
    | 'Revision response'
    | 'Site visit'
    | 'Vendor follow-up'
    | 'Inventory dispatch'
    | 'Quality check'
    | 'Client response'
    | 'Internal documentation'
  >;

  @Default('todo')
  @Column({
    type: DataType.ENUM(
      'todo',
      'in_progress',
      'review',
      'completed',
      'blocked',
    ),
  })
  declare status: CreationOptional<
    'todo' | 'in_progress' | 'review' | 'completed' | 'blocked'
  >;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: CreationOptional<string | null>;

  // ======================================================
  // TIMESTAMPS
  // ======================================================

  @Column(DataType.DATE)
  declare created_at: CreationOptional<Date>;

  @Column(DataType.DATE)
  declare updated_at: CreationOptional<Date>;
}
