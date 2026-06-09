import { Model } from 'sequelize-typescript';
import { Project } from '../../projects/models/project.model';
import { User } from '../../users/models/user.model';
export declare class Comment extends Model<Comment> {
    id: string;
    projectId: string;
    entityType: string;
    entityId: string;
    parentCommentId: string | null;
    comment: string;
    createdByUserId: string;
    isInternal: boolean;
    author: User;
    project: Project;
    created_at: Date;
    updated_at: Date;
}
