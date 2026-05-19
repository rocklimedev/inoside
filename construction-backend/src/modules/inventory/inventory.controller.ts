import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { InventoryService } from './inventory.service';
import { CreateInventoryDispatchDto } from './dto/create-inventory-dispatch.dto';
import { CreateInventoryRequestDto } from './dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from './dto/update-inventory-request.dto';
import { UpdateInventoryDispatchDto } from './dto/update-inventory-dispatch.dto';

import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ---------------- REQUESTS ----------------

  @Post('requests')
  createRequest(@Body() dto: CreateInventoryRequestDto) {
    return this.inventoryService.createRequest(dto);
  }

  @Get('requests')
  findAllRequests() {
    return this.inventoryService.findAllRequests();
  }

  @Get('requests/:id')
  findRequest(@Param('id') id: string) {
    return this.inventoryService.findRequestById(id);
  }

  @Put('requests/:id')
  updateRequest(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryRequestDto,
  ) {
    return this.inventoryService.updateRequest(id, dto);
  }

  @Delete('requests/:id')
  deleteRequest(@Param('id') id: string) {
    return this.inventoryService.deleteRequest(id);
  }

  // ---------------- DISPATCH ----------------

  @Post('dispatches')
  createDispatch(@Body() dto: CreateInventoryDispatchDto) {
    return this.inventoryService.createDispatch(dto);
  }

  @Get('dispatches')
  findAllDispatches() {
    return this.inventoryService.findAllDispatches();
  }

  @Put('dispatches/:id')
  updateDispatch(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDispatchDto,
  ) {
    return this.inventoryService.updateDispatch(id, dto);
  }

  // ---------------- MASTER ----------------

  @Post('master')
  createMaster(@Body() dto: CreateInventoryMasterDto) {
    return this.inventoryService.createMaster(dto);
  }

  @Get('master')
  findAllMaster() {
    return this.inventoryService.findAllMaster();
  }

  @Put('master/:id')
  updateMaster(@Param('id') id: string, @Body() dto: UpdateInventoryMasterDto) {
    return this.inventoryService.updateMaster(id, dto);
  }

  @Delete('master/:id')
  deleteMaster(@Param('id') id: string) {
    return this.inventoryService.deleteMaster(id);
  }

  // ---------------- MATERIALS ----------------

  @Get('materials')
  findMaterials() {
    return this.inventoryService.findAllMaterials();
  }
}
