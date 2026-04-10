// project-proposals.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectProposal } from './entities/project-proposal.entity';
import { CreateProjectProposalDto } from './dto/create-project-proposal.dto';

@Injectable()
export class ProjectProposalsService {
  constructor(
    @InjectRepository(ProjectProposal)
    private readonly repo: Repository<ProjectProposal>,
  ) {}

  async create(dto: CreateProjectProposalDto, userId: string) {
    // 🔥 enforce unique project proposal
    const exists = await this.repo.findOne({
      where: { project_id: dto.project_id },
    });

    if (exists) {
      throw new ConflictException('Proposal already exists for this project');
    }

    const proposal = this.repo.create({
      ...dto,
      prepared_by: userId,
    });

    return this.repo.save(proposal);
  }

  async findByProject(project_id: string) {
    return this.repo.findOne({
      where: { project_id },
      relations: ['preparer'],
    });
  }

  async update(id: string, data: Partial<ProjectProposal>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }
}
