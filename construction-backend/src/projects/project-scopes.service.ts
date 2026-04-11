import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectScope } from './entities/project-scopes.entity';
import { ScopeItem } from './entities/scope-item.entity';
import { CreateProjectScopeDto } from './dto/create-project-scope.dto';

@Injectable()
export class ProjectScopesService {
  constructor(
    @InjectRepository(ProjectScope)
    private readonly scopeRepo: Repository<ProjectScope>,
    @InjectRepository(ScopeItem)
    private readonly itemRepo: Repository<ScopeItem>,
  ) {}

  async createOrUpdate(project_id: string, dto: CreateProjectScopeDto) {
    let scope = await this.scopeRepo.findOne({ where: { project_id } });

    if (scope) {
      // Update existing
      await this.scopeRepo.update(scope.id, {
        service_type: dto.service_type,
        requirements_summary: dto.requirements_summary,
        site_summary: dto.site_summary,
      });
    } else {
      scope = this.scopeRepo.create({
        project_id,
        ...dto,
      });
      scope = await this.scopeRepo.save(scope);
    }

    // Handle scope items
    if (dto.scope_items?.length) {
      await this.itemRepo.delete({ scope_id: scope.id });
      const items = dto.scope_items.map((item) =>
        this.itemRepo.create({ scope_id: scope.id, ...item }),
      );
      await this.itemRepo.save(items);
    }

    return this.findByProject(project_id);
  }

  async findByProject(project_id: string) {
    return this.scopeRepo.findOne({
      where: { project_id },
      relations: ['scope_items'],
    });
  }
}
