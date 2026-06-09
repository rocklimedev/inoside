import { Comment } from './models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsService {
    private readonly commentModel;
    constructor(commentModel: typeof Comment);
    create(dto: CreateCommentDto, userId: string): Promise<Comment>;
    findAll(entityType: string, entityId: string): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    update(id: string, dto: UpdateCommentDto): Promise<Comment>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
