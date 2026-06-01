import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CostEstimatesController } from './controllers/cost-estimates.controller';

import { ProjectCostEstimateService } from './services/project-cost-estimate.service';

import { ProjectCostEstimate } from './models/project_cost_estimates.model';
import { Project } from './models/project.model';

@Module({
  imports: [SequelizeModule.forFeature([ProjectCostEstimate, Project])],
  controllers: [CostEstimatesController],
  providers: [ProjectCostEstimateService],
  exports: [ProjectCostEstimateService],
})
export class CostEstimatesModule {}
