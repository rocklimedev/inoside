import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectIssue } from './entities/project-issue.entity';
import { CreateProjectIssueDto } from './dto/create-project-issue.dto';
import { UpdateProjectIssueDto } from './dto/update-project-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { Project } from '../../projects/entities/project.entity';
import { Attachment } from '@/attachments/entities/attachments.entity';

@Injectable()
export class ProjectIssuesService {
  constructor(
    @InjectRepository(ProjectIssue)
    private readonly issueRepo: Repository<ProjectIssue>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {}

  async create(dto: CreateProjectIssueDto) {
    const project = await this.projectRepo.findOneBy({ id: dto.project_id });
    if (!project) throw new NotFoundException('Project not found');

    // Validate attachments if provided
    if (dto.before_photo_id) {
      const beforePhoto = await this.attachmentRepo.findOneBy({
        id: dto.before_photo_id,
      });
      if (!beforePhoto)
        throw new NotFoundException('Before photo attachment not found');
    }
    if (dto.after_photo_id) {
      const afterPhoto = await this.attachmentRepo.findOneBy({
        id: dto.after_photo_id,
      });
      if (!afterPhoto)
        throw new NotFoundException('After photo attachment not found');
    }

    const issue = this.issueRepo.create(dto);
    return this.issueRepo.save(issue);
  }

  async findAllByProject(projectId: string) {
    return this.issueRepo.find({
      where: { project_id: projectId },
      order: { created_at: 'DESC' },
      relations: ['beforePhoto', 'afterPhoto'],
    });
  }

  async findOne(id: string) {
    const issue = await this.issueRepo.findOne({
      where: { id },
      relations: ['beforePhoto', 'afterPhoto', 'project'],
    });

    if (!issue) throw new NotFoundException('Project issue not found');
    return issue;
  }

  async update(id: string, updateDto: UpdateProjectIssueDto) {
    const issue = await this.findOne(id);

    // Re-validate attachments if changed
    if (updateDto.before_photo_id) {
      const photo = await this.attachmentRepo.findOneBy({
        id: updateDto.before_photo_id,
      });
      if (!photo) throw new NotFoundException('Before photo not found');
    }
    if (updateDto.after_photo_id) {
      const photo = await this.attachmentRepo.findOneBy({
        id: updateDto.after_photo_id,
      });
      if (!photo) throw new NotFoundException('After photo not found');
    }

    Object.assign(issue, updateDto);
    return this.issueRepo.save(issue);
  }

  async updateStatus(id: string, statusDto: UpdateIssueStatusDto) {
    const issue = await this.findOne(id);

    issue.status = statusDto.status;

    if (statusDto.status === 'Closed' || statusDto.status === 'Resolved') {
      issue.closed_at = new Date();
    } else {
      issue.closed_at = null; // now allowed after the type change
    }

    return this.issueRepo.save(issue);
  }

  async addAfterPhoto(id: string, afterPhotoId: string) {
    const issue = await this.findOne(id);
    const photo = await this.attachmentRepo.findOneBy({ id: afterPhotoId });
    if (!photo) throw new NotFoundException('After photo not found');

    issue.after_photo_id = afterPhotoId;
    return this.issueRepo.save(issue);
  }

  async remove(id: string) {
    const issue = await this.findOne(id);
    return this.issueRepo.remove(issue);
  }
}
