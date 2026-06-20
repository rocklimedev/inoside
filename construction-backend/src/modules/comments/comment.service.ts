import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';

import { Comment } from './models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
  ) {}

  async create(dto: CreateCommentDto, userId: string) {
    const { mentionedUserIds, ...commentData } = dto; // optional: remove DTO field too

    const comment = await this.commentModel.create({
      ...commentData,
      createdByUserId: userId,
    } as CreationAttributes<Comment>);

    return this.findOne(comment.id);
  }

  async findAll(entityType: string, entityId: string) {
    return this.commentModel.findAll({
      where: { entityType, entityId },
      include: ['author'],
      order: [['created_at', 'ASC']],
    });
  }

  async findOne(id: string) {
    const comment = await this.commentModel.findByPk(id, {
      include: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    await comment.update(dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    await comment.destroy();
    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }
}
