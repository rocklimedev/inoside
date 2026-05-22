// ======================================================
// 📁 project-pitch.service.ts
// ======================================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { ProjectPitch } from '../models/project_pitch.model';
import { Project } from '../models/project.model';
import { Client } from '@/modules/clients/models/client.model';
import { Site } from '@/modules/sites/models/site.model';
import { User } from '@/modules/users/models/user.model';
import { PitchComment } from '../models/pitch-comment.model';
import { Address } from '@/modules/address/models/address.model';
@Injectable()
export class ProjectPitchService {
  constructor(
    @InjectModel(ProjectPitch)
    private pitchModel: typeof ProjectPitch,

    @InjectModel(Project)
    private projectModel: typeof Project,

    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(PitchComment)
    private commentModel: typeof PitchComment,
  ) {}

  // ======================================================
  // CREATE PITCH
  // ======================================================

  async createPitch(projectId: string, dto: any) {
    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const existing = await this.pitchModel.findOne({
      where: {
        project_id: projectId,
      },
    });

    if (existing) {
      throw new BadRequestException('Pitch already exists for this project');
    }

    return this.pitchModel.create({
      ...dto,
      project_id: projectId,
    });
  }

  // ======================================================
  // GET PITCH BY PROJECT
  // ======================================================

  async getPitch(projectId: string) {
    const pitch = await this.pitchModel.findOne({
      where: {
        project_id: projectId,
      },
      include: this.getIncludes(),
    });

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    return pitch;
  }

  // ======================================================
  // UPDATE PITCH
  // ======================================================

  async updatePitch(projectId: string, dto: any) {
    const pitch = await this.pitchModel.findOne({
      where: {
        project_id: projectId,
      },
    });

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    await pitch.update(dto);

    return this.getPitch(projectId);
  }

  // ======================================================
  // DELETE PITCH
  // ======================================================

  async deletePitch(id: string) {
    const pitch = await this.pitchModel.findByPk(id);

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    await pitch.destroy();

    return {
      success: true,
      message: 'Pitch deleted successfully',
    };
  }

  // ======================================================
  // GET ALL PITCHES
  // ======================================================

  async getAllPitches() {
    return this.pitchModel.findAll({
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET PITCH BY ID
  // ======================================================

  async getPitchById(id: string) {
    const pitch = await this.pitchModel.findByPk(id, {
      include: this.getIncludes(),
    });

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    return pitch;
  }

  // ======================================================
  // ADD COMMENT
  // ======================================================

  async addComment(
    pitchId: string,
    dto: {
      content: string;
      user_id?: string;
    },
  ) {
    const pitch = await this.pitchModel.findByPk(pitchId);

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    if (dto.user_id) {
      const user = await this.userModel.findByPk(dto.user_id);

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    return this.commentModel.create({
      pitch_id: pitchId,
      content: dto.content,
      user_id: dto.user_id || null,
    });
  }

  // ======================================================
  // REPLACE FILES
  // ======================================================

  async replacePitchFile(
    pitchId: string,
    dto: {
      pitch_pdf_url?: string;
      moodboard_pdf_url?: string;
    },
  ) {
    const pitch = await this.pitchModel.findByPk(pitchId);

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    await pitch.update(dto);

    return this.getPitchById(pitchId);
  }

  // ======================================================
  // APPROVE PITCH
  // ======================================================

  async approvePitch(id: string) {
    const pitch = await this.pitchModel.findByPk(id);

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    await pitch.update({
      status: 'Approved',
    });

    return this.getPitchById(id);
  }

  // ======================================================
  // REJECT PITCH
  // ======================================================

  async rejectPitch(id: string) {
    const pitch = await this.pitchModel.findByPk(id);

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    await pitch.update({
      status: 'Rejected',
    });

    return this.getPitchById(id);
  }
  async getComments(pitchId: string) {
    const pitch = await this.pitchModel.findByPk(pitchId);

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    return this.commentModel.findAll({
      where: { pitch_id: pitchId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
  async updateComment(commentId: string, dto: { content?: string }) {
    const comment = await this.commentModel.findByPk(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await comment.update(dto);

    return this.commentModel.findByPk(commentId, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }
  async deleteComment(commentId: string) {
    const comment = await this.commentModel.findByPk(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await comment.destroy();

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }
  async deleteByProject(projectId: string) {
    const pitch = await this.pitchModel.findOne({
      where: { project_id: projectId },
    });

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    await pitch.destroy();

    return {
      success: true,
      message: 'Pitch deleted successfully',
    };
  }
  // ======================================================
  // COMMON INCLUDE
  // ======================================================

  private getIncludes() {
    return [
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
            attributes: ['id', 'ownership_status', 'access_available'],

            include: [
              {
                model: Address,
                attributes: [
                  'id',
                  'line1',
                  'line2',
                  'landmark',
                  'city',
                  'state',
                  'country',
                  'pincode',
                ],
              },
            ],
          },
        ],
      },
      {
        model: User,
        as: 'createdByUser',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: PitchComment,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
        ],
      },
    ];
  }
}
