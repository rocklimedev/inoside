import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RekiReport } from '../models/reki_reports.model';
import { Project } from '../models/project.model';

@Injectable()
export class RekiReportService {
  constructor(
    @InjectModel(RekiReport) private rekiModel: typeof RekiReport,
    @InjectModel(Project) private projectModel: typeof Project,
  ) {}

  async create(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });

    const exists = await this.rekiModel.findOne({
      where: { project_id: dto.project_id },
    });
    if (exists) throw new BadRequestException('Reki Report already exists');

    return this.rekiModel.create(dto);
  }

  async findOne(project_id: string) {
    const reki = await this.rekiModel.findOne({ where: { project_id } });
    if (!reki) throw new NotFoundException('Reki Report not found');
    return reki;
  }

  async update(project_id: string, dto: any) {
    await this.findOne(project_id);
    await this.rekiModel.update(dto, { where: { project_id } });
    return this.findOne(project_id);
  }
}
