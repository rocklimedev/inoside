import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Project } from './models/project.model';
import { Client } from '../clients/models/client.model';
import { Site } from '../sites/models/site.model';
import { User } from '../users/models/user.model';

// ================= NEW MODULE MODELS =================
import { ProjectBrief } from './models/project_brief.model';
import { ProjectPitch } from './models/project_pitch.model';
import { PitchReference } from './models/pitch_references.model';
import { RekiReport } from './models/reki_reports.model';
import { RekiPhoto } from './models/reki_photos.model';
import { ScopeOfWork } from './models/scope_of_work.model';
import { ProjectCostEstimate } from './models/project_cost_estimates.model';
import { ProjectDrawing } from './models/project-drawings.model';
import { DrawingApprovalLog } from './models/drawing_approval_logs.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(Site) private siteModel: typeof Site,
    @InjectModel(User) private userModel: typeof User,

    // ================= NEW MODELS =================
    @InjectModel(ProjectBrief) private briefModel: typeof ProjectBrief,
    @InjectModel(ProjectPitch) private pitchModel: typeof ProjectPitch,
    @InjectModel(PitchReference) private pitchRefModel: typeof PitchReference,
    @InjectModel(RekiReport) private rekiModel: typeof RekiReport,
    @InjectModel(RekiPhoto) private rekiPhotoModel: typeof RekiPhoto,
    @InjectModel(ScopeOfWork) private scopeModel: typeof ScopeOfWork,
    @InjectModel(ProjectCostEstimate)
    private costModel: typeof ProjectCostEstimate,
    @InjectModel(ProjectDrawing) private drawingModel: typeof ProjectDrawing,
    @InjectModel(DrawingApprovalLog)
    private approvalLogModel: typeof DrawingApprovalLog,
  ) {}

  // =================================================
  // CREATE PROJECT
  // =================================================
  async create(dto: any) {
    const client = await this.clientModel.findByPk(dto.client_id);

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    const project = await this.projectModel.create(dto);

    return this.findOne(project.id);
  }

  // =================================================
  // GET ALL PROJECTS
  // =================================================
  async findAll() {
    return this.projectModel.findAll({
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number', 'email'],
        },
        {
          model: Site,
          attributes: ['id', 'address', 'city'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // =================================================
  // GET ONE PROJECT
  // =================================================
  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number', 'email'],
        },
        {
          model: Site,
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  // =================================================
  // UPDATE PROJECT
  // =================================================
  async update(id: string, dto: any) {
    const project = await this.findOne(id);

    await project.update(dto);

    return this.findOne(id);
  }

  // =================================================
  // DELETE PROJECT
  // =================================================
  async remove(id: string) {
    const project = await this.findOne(id);

    await project.destroy();

    return { message: 'Project deleted successfully' };
  }

  // =================================================
  // UPDATE PROGRESS
  // =================================================
  async updateProgress(id: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    const project = await this.findOne(id);

    await project.update({ progress_percentage: progress });

    return this.findOne(id);
  }

  // =================================================
  // 🧠 PROJECT BRIEF
  // =================================================
  async createBrief(dto: any) {
    await this.findOne(dto.project_id);

    const exists = await this.briefModel.findOne({
      where: { project_id: dto.project_id },
    });

    if (exists) {
      throw new BadRequestException('Brief already exists');
    }

    return this.briefModel.create(dto);
  }

  async getBrief(project_id: string) {
    const brief = await this.briefModel.findOne({ where: { project_id } });

    if (!brief) throw new NotFoundException('Brief not found');

    return brief;
  }

  async updateBrief(project_id: string, dto: any) {
    await this.getBrief(project_id);

    await this.briefModel.update(dto, { where: { project_id } });

    return this.getBrief(project_id);
  }

  // =================================================
  // 🎨 PROJECT PITCH
  // =================================================
  async createPitch(dto: any) {
    await this.findOne(dto.project_id);
    await this.pitchModel.create(dto);
    return this.getPitch(dto.project_id);
  }

  async getPitch(project_id: string) {
    const pitch = await this.pitchModel.findOne({
      where: { project_id },
      include: [PitchReference],
    });

    if (!pitch) throw new NotFoundException('Pitch not found');

    return pitch;
  }

  async updatePitch(project_id: string, dto: any) {
    await this.getPitch(project_id);

    await this.pitchModel.update(dto, { where: { project_id } });

    return this.getPitch(project_id);
  }
  // =================================================
  // 🧠 GET ALL BRIEFS
  // =================================================
  async getAllBriefs() {
    return this.briefModel.findAll({
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'status'],
          include: [
            {
              model: Client,
              attributes: ['id', 'name', 'email', 'contact_number'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
  // =================================================
  // 🧠 GET BRIEF BY BRIEF ID
  // =================================================
  async getBriefById(id: string) {
    const brief = await this.briefModel.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'status'],
          include: [
            {
              model: Client,
              attributes: ['id', 'name', 'email', 'contact_number'],
            },
            {
              model: Site,
              attributes: ['id', 'address', 'city'],
            },
          ],
        },
      ],
    });

    if (!brief) {
      throw new NotFoundException(`Brief with ID ${id} not found`);
    }

    return brief;
  }
  // =================================================
  // 🧩 PITCH REFERENCES
  // =================================================
  async addPitchReference(dto: any) {
    await this.findOne(dto.project_id);
    return this.pitchRefModel.create(dto);
  }

  async getPitchReferences(project_id: string) {
    return this.pitchRefModel.findAll({ where: { project_id } });
  }

  async deletePitchReference(id: string) {
    return this.pitchRefModel.destroy({ where: { id } });
  }

  // =================================================
  // 🏗️ REKI REPORT
  // =================================================
  async createReki(dto: any) {
    await this.findOne(dto.project_id);

    const exists = await this.rekiModel.findOne({
      where: { project_id: dto.project_id },
    });

    if (exists) {
      throw new BadRequestException('Reki already exists');
    }

    return this.rekiModel.create(dto);
  }

  async getReki(project_id: string) {
    const reki = await this.rekiModel.findOne({ where: { project_id } });

    if (!reki) throw new NotFoundException('Reki not found');

    return reki;
  }

  async updateReki(project_id: string, dto: any) {
    await this.getReki(project_id);

    await this.rekiModel.update(dto, { where: { project_id } });

    return this.getReki(project_id);
  }

  // =================================================
  // 📸 REKI PHOTOS
  // =================================================
  async addRekiPhoto(dto: any) {
    await this.findOne(dto.project_id);
    return this.rekiPhotoModel.create(dto);
  }

  async getRekiPhotos(reki_report_id: string) {
    return this.rekiPhotoModel.findAll({ where: { reki_report_id } });
  }

  async deleteRekiPhoto(id: string) {
    return this.rekiPhotoModel.destroy({ where: { id } });
  }

  // =================================================
  // 📐 SCOPE OF WORK
  // =================================================
  async createScope(dto: any) {
    await this.findOne(dto.project_id);

    const exists = await this.scopeModel.findOne({
      where: { project_id: dto.project_id },
    });

    if (exists) {
      throw new BadRequestException('Scope already exists');
    }

    return this.scopeModel.create(dto);
  }

  async getScope(project_id: string) {
    const scope = await this.scopeModel.findOne({
      where: { project_id },
    });

    if (!scope) throw new NotFoundException('Scope not found');

    return scope;
  }

  async updateScope(project_id: string, dto: any) {
    await this.getScope(project_id);

    await this.scopeModel.update(dto, { where: { project_id } });

    return this.getScope(project_id);
  }

  // =================================================
  // 💰 COST ESTIMATES
  // =================================================
  async addCostEstimate(dto: any) {
    await this.findOne(dto.project_id);
    return this.costModel.create(dto);
  }

  async getCostEstimates(project_id: string) {
    return this.costModel.findAll({ where: { project_id } });
  }

  async updateCostEstimate(id: string, dto: any) {
    await this.costModel.update(dto, { where: { id } });
    return this.costModel.findByPk(id);
  }

  // =================================================
  // 🧾 DRAWINGS
  // =================================================
  async uploadDrawing(dto: any) {
    await this.findOne(dto.project_id);
    return this.drawingModel.create(dto);
  }

  async getDrawings(project_id: string) {
    return this.drawingModel.findAll({
      where: { project_id },
      order: [['uploaded_at', 'DESC']],
    });
  }

  async approveDrawing(id: string, user_id: string) {
    const drawing = await this.drawingModel.findByPk(id);

    if (!drawing) throw new NotFoundException('Drawing not found');

    await drawing.update({
      approved: true,
      approved_by: user_id,
      approval_date: new Date(),
    });

    return drawing;
  }

  // =================================================
  // 📊 APPROVAL LOGS
  // =================================================
  async addApprovalLog(dto: any) {
    return this.approvalLogModel.create(dto);
  }

  async getApprovalLogs(drawing_id: string) {
    return this.approvalLogModel.findAll({
      where: { drawing_id },
      order: [['created_at', 'DESC']],
    });
  }
}
