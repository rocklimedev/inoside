import { CommentEntityType } from '@/common/enums';
export declare class CreateCommentDto {
    projectId: string;
    entityType: CommentEntityType;
    entityId: string;
    parentCommentId?: string;
    comment: string;
    isInternal?: boolean;
    mentionedUserIds?: string[];
}
