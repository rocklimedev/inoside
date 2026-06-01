import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ProjectCostEstimateService } from '../services/project-cost-estimate.service';

interface EstimateItem {
  title: string;
  description: string;
}

interface PaymentPlanItem {
  title: string;
  description: string;
}

interface CreateCostEstimateDto {
  estimate_type: 'Consultation' | 'Turnkey' | 'Constructional';
  consultation_fee?: number;
  tentative_total_cost?: number;
  material_labour_estimate?: EstimateItem[];
  payment_plan?: PaymentPlanItem[];
  annexure_url?: string;
  contract_url?: string;
}

@Controller('cost-estimates')
@UseGuards(JwtAuthGuard)
export class CostEstimatesController {
  constructor(private readonly costService: ProjectCostEstimateService) {}

  // GET /cost-estimates
  @Get()
  findAll() {
    return this.costService.findAll();
  }

  // POST /cost-estimates/project/:id
  @Post('project/:id')
  addEstimate(
    @Param('id') projectId: string,
    @Body() dto: CreateCostEstimateDto,
  ) {
    this.validate(dto);

    return this.costService.add({
      ...dto,
      project_id: projectId,
    });
  }

  // GET /cost-estimates/project/:id
  @Get('project/:id')
  getEstimates(@Param('id') projectId: string) {
    return this.costService.findByProject(projectId);
  }

  // PATCH /cost-estimates/:estimateId
  @Patch(':estimateId')
  updateEstimate(
    @Param('estimateId') estimateId: string,
    @Body() dto: Partial<CreateCostEstimateDto>,
  ) {
    this.validate(dto);

    return this.costService.update(estimateId, dto);
  }

  // DELETE /cost-estimates/:estimateId
  @Delete(':estimateId')
  deleteEstimate(@Param('estimateId') estimateId: string) {
    return this.costService.delete(estimateId);
  }

  private validate(dto: any) {
    // existing validation
  }
}
