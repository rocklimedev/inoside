// dto/create-attachment.dto.ts
import { IsEnum, IsUUID, IsString } from 'class-validator';
import {
  AttachmentEntityType,
  FileTypeEnum,
} from '../entities/attachments.entity';

export class CreateAttachmentDto {
  @IsEnum(AttachmentEntityType)
  entity_type!: AttachmentEntityType;

  @IsUUID()
  entity_id!: string;

  @IsString()
  file_path!: string;

  @IsEnum(FileTypeEnum)
  file_type!: FileTypeEnum;
}
