// modules/activity-logs/models/activity-log.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'activity_logs',
  timestamps: true,
})
export class ActivityLog extends Model<ActivityLog> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  activityLogId!: string;

  @Column(DataType.UUID)
  userId?: string;

  @Column(DataType.STRING(100))
  userName?: string;

  @Column(DataType.STRING(100))
  contextTag!: string;

  @Column(DataType.STRING(100))
  subContext?: string;

  @Column(DataType.STRING(100))
  action!: string;

  @Column(DataType.STRING(255))
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.UUID)
  referenceId?: string;

  @Column(DataType.STRING(100))
  referenceType?: string;

  @Column(DataType.JSON)
  metadata?: Record<string, any>;

  @Column(DataType.STRING(45))
  ipAddress?: string;

  @Column(DataType.TEXT)
  userAgent?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isSystemGenerated!: boolean;

  // ==========================================
  // ERP AUDIT EXTENSIONS
  // ==========================================

  @Default('INFO')
  @Column(DataType.ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL'))
  severity!: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

  @Column(DataType.STRING(100))
  moduleName?: string;

  @Column(DataType.JSON)
  oldValues?: Record<string, any>;

  @Column(DataType.JSON)
  newValues?: Record<string, any>;
}
