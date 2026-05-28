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

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class CostEstimatesController {
  constructor(private readonly costService: ProjectCostEstimateService) {}

  // ---------------- CREATE ----------------
  @Post(':id/cost-estimates')
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

  // ---------------- READ ----------------
  @Get(':id/cost-estimates')
  getEstimates(@Param('id') projectId: string) {
    return this.costService.findByProject(projectId);
  }

  // ---------------- UPDATE ----------------
  @Patch('cost-estimates/:estimateId')
  updateEstimate(
    @Param('estimateId') estimateId: string,
    @Body() dto: Partial<CreateCostEstimateDto>,
  ) {
    this.validate(dto);

    return this.costService.update(estimateId, dto);
  }

  // ---------------- DELETE ----------------
  @Delete('cost-estimates/:estimateId')
  deleteEstimate(@Param('estimateId') estimateId: string) {
    return this.costService.delete(estimateId);
  }

  // ---------------- VALIDATION ----------------
  private validate(dto: any) {
    const isValidArray = (arr: any) =>
      Array.isArray(arr) &&
      arr.every(
        (i) => typeof i.title === 'string' && typeof i.description === 'string',
      );

    if (
      dto.material_labour_estimate &&
      !isValidArray(dto.material_labour_estimate)
    ) {
      throw new BadRequestException(
        'material_labour_estimate must be [{title, description}]',
      );
    }

    if (dto.payment_plan && !isValidArray(dto.payment_plan)) {
      throw new BadRequestException(
        'payment_plan must be [{title, description}]',
      );
    }
  }
}
