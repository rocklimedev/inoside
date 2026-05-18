import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectDrawing } from '../models/project-drawings.model';
import { Project } from '../models/project.model';
import { User } from '@/modules/users/models/user.model';

@Injectable()
export class ProjectDrawingService {
  constructor(
    @InjectModel(ProjectDrawing) private drawingModel: typeof ProjectDrawing,
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async upload(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
    return this.drawingModel.create(dto);
  }

  async findByProject(project_id: string) {
    return this.drawingModel.findAll({
      where: { project_id },
      order: [['uploaded_at', 'DESC']],
    });
  }

  async approve(id: string, user_id: string) {
    const drawing = await this.drawingModel.findByPk(id);
    if (!drawing) throw new NotFoundException('Drawing not found');

    const user = await this.userModel.findByPk(user_id);
    if (!user) throw new NotFoundException('User not found');

    await drawing.update({
      approved: true,
      approved_by: user_id,
      approval_date: new Date(),
    });

    return drawing;
  }

  async delete(id: string) {
    return this.drawingModel.destroy({ where: { id } });
  }
}
