import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { InventoryDispatchService } from './services/inventory-dispatch.service';
import { DispatchMaterialDto } from './dto/dispatch-material.dto';

@Controller('inventory/dispatch')
export class InventoryDispatchController {
  constructor(private readonly service: InventoryDispatchService) {}

  @Post()
  dispatch(@Body() dto: DispatchMaterialDto) {
    return this.service.dispatch(dto);
  }

  @Patch(':id/delivered')
  markDelivered(
    @Param('id') id: string,
    @Body('received_quantity') qty: number,
  ) {
    return this.service.markDelivered(id, qty);
  }
}
