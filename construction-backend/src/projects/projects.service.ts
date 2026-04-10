import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Address } from '@/users/entities/address.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) {}

  // ====================== CREATE ======================
  async create(dto: CreateProjectDto, clientId?: string): Promise<Project> {
    // Validate primary site address if provided
    if (dto.primary_site_address_id) {
      const address = await this.addressRepo.findOneBy({
        id: dto.primary_site_address_id,
      });
      if (!address) {
        throw new BadRequestException('Invalid primary site address');
      }
    }

    // Safely create entity (avoids DeepPartial type issues)
    const project = this.projectsRepo.create({
      ...dto,
      client_user_id: clientId || dto.client_user_id,
      // Convert numbers to string for decimal columns (Postgres)
      approx_area: dto.approx_area?.toString() ?? null,
      func_vs_aesth: dto.func_vs_aesth?.toString() ?? null,
    });

    return this.projectsRepo.save(project);
  }

  // ====================== READ ======================
  async findAll(): Promise<Project[]> {
    return this.projectsRepo.find({
      relations: ['client', 'primary_site_address'],
      order: { created_at: 'DESC' },
    });
  }

  async findByClient(clientId: string): Promise<Project[]> {
    return this.projectsRepo.find({
      where: { client_user_id: clientId },
      relations: ['primary_site_address'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepo.findOne({
      where: { id },
      relations: ['client', 'primary_site_address'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByStatus(status: string): Promise<Project[]> {
    return this.projectsRepo.find({
      where: { status },
      relations: ['client', 'primary_site_address'],
    });
  }

  // ====================== UPDATE ======================
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (updateProjectDto.primary_site_address_id) {
      const address = await this.addressRepo.findOneBy({
        id: updateProjectDto.primary_site_address_id,
      });
      if (!address) {
        throw new BadRequestException('Address not found');
      }
    }

    // Safe assignment with decimal conversion
    Object.assign(project, updateProjectDto, {
      overall_completion:
        updateProjectDto.overall_completion?.toString() ??
        project.overall_completion,
      approx_area:
        updateProjectDto.approx_area?.toString() ?? project.approx_area,
      func_vs_aesth:
        updateProjectDto.func_vs_aesth?.toString() ?? project.func_vs_aesth,
    });

    return this.projectsRepo.save(project);
  }

  // ====================== PROGRESS & STATUS ======================
  async updateCompletion(id: string, completion: number): Promise<Project> {
    if (completion < 0 || completion > 100) {
      throw new BadRequestException('Completion must be between 0 and 100');
    }

    const project = await this.findOne(id);

    project.overall_completion = completion.toString();

    if (completion === 100) {
      project.status = 'completed';
    }

    return this.projectsRepo.save(project);
  }

  async updateStatus(
    id: string,
    status: string,
    currentStage?: string,
  ): Promise<Project> {
    const project = await this.findOne(id);

    project.status = status;
    if (currentStage) {
      project.current_stage = currentStage;
    }

    return this.projectsRepo.save(project);
  }

  // ====================== DELETE ======================
  async softDelete(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepo.remove(project); // Note: This is hard delete. Use softRemove() if you add @DeleteDateColumn
  }

  // ====================== DASHBOARD HELPERS ======================
  async getActiveProjectsCount(): Promise<number> {
    return this.projectsRepo.count({
      where: { status: 'active' },
    });
  }

  async getProjectsStats() {
    const total = await this.projectsRepo.count();
    const completed = await this.projectsRepo.count({
      where: { status: 'completed' },
    });
    const inProgress = await this.projectsRepo.count({
      where: { status: 'active' },
    });

    return { total, completed, inProgress };
  }
}
