import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskType {
  GENERAL = 'General',
  DESIGN_UPLOAD = 'Design upload',
  REVISION_RESPONSE = 'Revision response',
  SITE_VISIT = 'Site visit',
  VENDOR_FOLLOW_UP = 'Vendor follow-up',
  INVENTORY_DISPATCH = 'Inventory dispatch',
  QUALITY_CHECK = 'Quality check',
  CLIENT_RESPONSE = 'Client response',
  INTERNAL_DOCUMENTATION = 'Internal documentation',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

export class CreateTaskDto {
  // ======================================================
  // PROJECT
  // ======================================================

  @IsNotEmpty({
    message: 'Project ID is required',
  })
  @IsUUID('all', {
    message: 'Invalid Project ID format',
  })
  project_id!: string;

  // ======================================================
  // TASK DETAILS
  // ======================================================

  @IsNotEmpty({
    message: 'Task title is required',
  })
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // ======================================================
  // ASSIGNED USER
  // ======================================================

  @IsOptional()
  @IsUUID('all', {
    message: 'Assigned user ID must be a valid UUID',
  })
  assigned_to_user_id?: string;

  // ======================================================
  // DUE DATE
  // ======================================================

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Due date must be a valid date',
    },
  )
  due_date?: string;

  // ======================================================
  // PRIORITY
  // ======================================================

  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'Invalid priority value',
  })
  priority?: TaskPriority;

  // ======================================================
  // TASK TYPE
  // ======================================================

  @IsOptional()
  @IsEnum(TaskType, {
    message: 'Invalid task type',
  })
  task_type?: TaskType;

  // ======================================================
  // STATUS
  // ======================================================

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Invalid status value',
  })
  status?: TaskStatus;
}
