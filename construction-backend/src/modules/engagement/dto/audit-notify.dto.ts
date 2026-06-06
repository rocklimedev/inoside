import { AuditDto } from './audit.dto';
import { NotifyDto } from './notify.dto';

export class AuditAndNotifyDto {
  audit!: AuditDto;

  notification!: NotifyDto;
}
