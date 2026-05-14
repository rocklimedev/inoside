import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InventoryRequestService } from './services/inventory-request.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('inventory/requests')
export class InventoryRequestController {
  constructor(private readonly service: InventoryRequestService) {}

  @Post()
  create(@Body() dto: CreateRequestDto) {
    return this.service.create(dto, 'USER_ID');
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id, 'ADMIN_ID');
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }
}
