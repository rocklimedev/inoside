import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PitchReference } from '../models/pitch_references.model';
import { Project } from '../models/project.model';

@Injectable()
export class PitchReferenceService {
  constructor(
    @InjectModel(PitchReference) private pitchRefModel: typeof PitchReference,
    @InjectModel(Project) private projectModel: typeof Project,
  ) {}

  async add(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
    return this.pitchRefModel.create(dto);
  }

  async findByProject(project_id: string) {
    return this.pitchRefModel.findAll({ where: { project_id } });
  }

  async delete(id: string) {
    return this.pitchRefModel.destroy({ where: { id } });
  }
}
