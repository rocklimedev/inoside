import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DrawingApprovalLog } from '../models/drawing_approval_logs.model';
import { User } from '@/modules/users/models/user.model';
@Injectable()
export class DrawingApprovalLogService {
  constructor(
    @InjectModel(DrawingApprovalLog)
    private approvalLogModel: typeof DrawingApprovalLog,
  ) {}

  async create(dto: any) {
    return this.approvalLogModel.create(dto);
  }

  async findByDrawing(drawing_id: string) {
    return this.approvalLogModel.findAll({
      where: { drawing_id },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User, // assuming you have User association
          as: 'approver',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }
}
