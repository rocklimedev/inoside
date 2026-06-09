import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(dto: CreateCommentDto): Promise<import("./models/comment.model").Comment>;
    findAll(entityType: string, entityId: string): Promise<import("./models/comment.model").Comment[]>;
    findOne(id: string): Promise<import("./models/comment.model").Comment>;
    update(id: string, dto: UpdateCommentDto): Promise<import("./models/comment.model").Comment>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
