import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { RekiPhoto } from '../models/reki_photos.model';
import { Project } from '@/modules/projects/models/project.model';
import { RekiReport } from '../models/reki_reports.model';

@Injectable()
export class RekiPhotoService {
  constructor(
    @InjectModel(RekiPhoto)
    private rekiPhotoModel: typeof RekiPhoto,

    @InjectModel(Project)
    private projectModel: typeof Project,

    @InjectModel(RekiReport)
    private rekiModel: typeof RekiReport,
  ) {}

  // ======================================================
  // COMMON INCLUDE
  // ======================================================

  private getIncludes() {
    return [
      {
        model: Project,
        attributes: ['id', 'name', 'status', 'progress_percentage'],
      },
      {
        model: RekiReport,
        attributes: ['id', 'project_id'],
      },
    ];
  }

  // ======================================================
  // ADD PHOTO
  // ======================================================

  async add(dto: any) {
    // ------------------------------------------
    // VALIDATE PROJECT
    // ------------------------------------------

    const project = await this.projectModel.findByPk(dto.project_id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // ------------------------------------------
    // VALIDATE REKI REPORT
    // ------------------------------------------

    if (dto.reki_report_id) {
      const reki = await this.rekiModel.findByPk(dto.reki_report_id);

      if (!reki) {
        throw new NotFoundException('Reki Report not found');
      }
    }

    // ------------------------------------------
    // VALIDATE IMAGE URL
    // ------------------------------------------

    if (!dto.image_url) {
      throw new BadRequestException('image_url is required');
    }

    // ------------------------------------------
    // CREATE PHOTO
    // ------------------------------------------

    return this.rekiPhotoModel.create(dto);
  }

  // ======================================================
  // GET PHOTO BY ID
  // ======================================================

  async findById(id: string) {
    const photo = await this.rekiPhotoModel.findByPk(id, {
      include: this.getIncludes(),
    });

    if (!photo) {
      throw new NotFoundException('Reki photo not found');
    }

    return photo;
  }

  // ======================================================
  // GET PHOTOS BY REKI REPORT
  // ======================================================

  async findByReki(rekiReportId: string) {
    return this.rekiPhotoModel.findAll({
      where: {
        reki_report_id: rekiReportId,
      },
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // UPDATE PHOTO
  // ======================================================

  async update(id: string, dto: any) {
    const photo = await this.rekiPhotoModel.findByPk(id);

    if (!photo) {
      throw new NotFoundException('Reki photo not found');
    }

    await photo.update(dto);

    return this.findById(id);
  }

  // ======================================================
  // DELETE PHOTO
  // ======================================================

  async delete(id: string) {
    const photo = await this.rekiPhotoModel.findByPk(id);

    if (!photo) {
      throw new NotFoundException('Reki photo not found');
    }

    await photo.destroy();

    return {
      success: true,
      message: 'Reki photo deleted successfully',
    };
  }

  // ======================================================
  // BULK DELETE PHOTOS
  // ======================================================

  async bulkDelete(ids: string[]) {
    await this.rekiPhotoModel.destroy({
      where: {
        id: ids,
      },
    });

    return {
      success: true,
      message: 'Photos deleted successfully',
    };
  }
}
