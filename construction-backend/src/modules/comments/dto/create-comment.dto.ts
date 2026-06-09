import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ArrayUnique,
} from 'class-validator';

import { CommentEntityType } from '@/common/enums';
export class CreateCommentDto {
  @IsUUID()
  projectId!: string;

  @IsEnum(CommentEntityType)
  entityType!: CommentEntityType;

  @IsUUID()
  entityId!: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;

  @IsString()
  comment!: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  mentionedUserIds?: string[];
}
