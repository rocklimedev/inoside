import { ActivityAction } from '@/common/enums';
import { ContextTag } from '@/common/enums';
import { ActivitySeverity } from '@/common/enums';
export class AuditDto {
  actor?: {
    userId: string;
    userName: string;
  };

  contextTag!: ContextTag;

  action!: ActivityAction;

  severity?: ActivitySeverity;

  title!: string;

  description?: string;

  moduleName?: string;

  referenceId?: string;

  referenceType?: string;

  metadata?: Record<string, any>;

  oldValues?: Record<string, any>;

  newValues?: Record<string, any>;
}
