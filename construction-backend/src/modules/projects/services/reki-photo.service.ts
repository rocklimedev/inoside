import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RekiPhoto } from '../models/reki_photos.model';
import { Project } from '../models/project.model';

@Injectable()
export class RekiPhotoService {
  constructor(
    @InjectModel(RekiPhoto) private rekiPhotoModel: typeof RekiPhoto,
    @InjectModel(Project) private projectModel: typeof Project,
  ) {}

  async add(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
    return this.rekiPhotoModel.create(dto);
  }

  async findByReki(reki_report_id: string) {
    return this.rekiPhotoModel.findAll({ where: { reki_report_id } });
  }

  async delete(id: string) {
    return this.rekiPhotoModel.destroy({ where: { id } });
  }
}
