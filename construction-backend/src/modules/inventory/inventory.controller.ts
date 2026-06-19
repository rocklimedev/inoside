import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';

import { InventoryService } from './inventory.service';

import { CreateInventoryRequestDto } from './dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from './dto/update-inventory-request.dto';

import { CreateInventoryDispatchDto } from './dto/create-inventory-dispatch.dto';
import { UpdateInventoryDispatchDto } from './dto/update-inventory-dispatch.dto';

import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';
import { CreateProjectMaterialDto } from './dto/create-material.dto';
import { UpdateProjectMaterialDto } from './dto/update-material';
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ====================== UNITS ======================
  @Post('units')
  createUnit(@Body() body: { name: string; short_name: string }) {
    return this.inventoryService.createUnit(body.name, body.short_name);
  }

  @Get('units')
  findAllUnits() {
    return this.inventoryService.findAllUnits();
  }

  @Get('units/:id')
  findUnit(@Param('id') id: string) {
    return this.inventoryService.findUnitById(id);
  }

  @Get('units/short/:shortName')
  findUnitByShortName(@Param('shortName') shortName: string) {
    return this.inventoryService.findUnitByShortName(shortName);
  }

  @Put('units/:id')
  updateUnit(
    @Param('id') id: string,
    @Body() body: { name?: string; short_name?: string },
  ) {
    return this.inventoryService.updateUnit(id, body.name, body.short_name);
  }

  @Delete('units/:id')
  deleteUnit(@Param('id') id: string) {
    return this.inventoryService.deleteUnit(id);
  }

  // ====================== INVENTORY REQUESTS ======================
  @Post('requests')
  createRequest(@Body() dto: CreateInventoryRequestDto) {
    return this.inventoryService.createRequest(dto);
  }

  @Get('requests')
  findAllRequests() {
    return this.inventoryService.findAllRequests();
  }
  @Get('project/:projectId/requests')
  getRequestsByProject(@Param('projectId') projectId: string) {
    return this.inventoryService.getRequestsByProject(projectId);
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

  // ====================== INVENTORY DISPATCHES ======================
  @Post('dispatches')
  createDispatch(@Body() dto: CreateInventoryDispatchDto) {
    return this.inventoryService.createDispatch(dto);
  }

  @Get('dispatches')
  findAllDispatches() {
    return this.inventoryService.findAllDispatches();
  }

  @Get('dispatches/:id')
  findDispatch(@Param('id') id: string) {
    return this.inventoryService.findDispatchById(id);
  }

  @Put('dispatches/:id')
  updateDispatch(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDispatchDto,
  ) {
    return this.inventoryService.updateDispatch(id, dto);
  }

  @Delete('dispatches/:id')
  deleteDispatch(@Param('id') id: string) {
    return this.inventoryService.deleteDispatch(id);
  }

  // ====================== INVENTORY MASTER ======================
  @Post('master')
  createMaster(@Body() dto: CreateInventoryMasterDto) {
    return this.inventoryService.createMaster(dto);
  }

  @Get('master')
  findAllMaster() {
    return this.inventoryService.findAllMaster();
  }

  @Get('master/:id')
  findMaster(@Param('id') id: string) {
    return this.inventoryService.findMasterById(id);
  }

  @Put('master/:id')
  updateMaster(@Param('id') id: string, @Body() dto: UpdateInventoryMasterDto) {
    return this.inventoryService.updateMaster(id, dto);
  }

  @Delete('master/:id')
  deleteMaster(@Param('id') id: string) {
    return this.inventoryService.deleteMaster(id);
  }

  // ====================== PROJECT MATERIALS ======================

  @Get('materials')
  findAllProjectMaterials() {
    return this.inventoryService.findAllProjectMaterials();
  }

  @Get('materials/:id')
  findProjectMaterial(@Param('id') id: string) {
    return this.inventoryService.findProjectMaterialById(id);
  }
  @Post('projects/materials')
  createProjectMaterial(@Body() dto: CreateProjectMaterialDto) {
    return this.inventoryService.createProjectMaterial(dto);
  }
  @Put('projects/materials/:id')
  updateProjectMaterial(
    @Param('id') id: string,
    @Body() dto: UpdateProjectMaterialDto,
  ) {
    return this.inventoryService.updateProjectMaterial(id, dto);
  }
  @Delete('projects/materials/:id')
  deleteProjectMaterial(@Param('id') id: string) {
    return this.inventoryService.deleteProjectMaterial(id);
  }
  @Get('projects/:projectId/materials')
  findProjectMaterialsByProject(@Param('projectId') projectId: string) {
    return this.inventoryService.findProjectMaterialsByProject(projectId);
  }

  @Get('projects/:projectId/materials/summary')
  getProjectMaterialSummary(@Param('projectId') projectId: string) {
    return this.inventoryService.getProjectMaterialSummary(projectId);
  }

  @Get('projects/:projectId/materials/status')
  getProjectMaterialStatus(@Param('projectId') projectId: string) {
    return this.inventoryService.getProjectMaterialStatus(projectId);
  }

  @Get('projects/:projectId/materials/consumption')
  getMaterialConsumption(@Param('projectId') projectId: string) {
    return this.inventoryService.getMaterialConsumption(projectId);
  }

  @Get('projects/:projectId/materials/value')
  getProjectInventoryValue(@Param('projectId') projectId: string) {
    return this.inventoryService.getProjectInventoryValue(projectId);
  }

  @Get('materials/pending')
  getPendingMaterials() {
    return this.inventoryService.getPendingMaterials();
  }

  @Get('projects/:projectId/materials/pending')
  getProjectPendingMaterials(@Param('projectId') projectId: string) {
    return this.inventoryService.getPendingMaterials(projectId);
  }
  // ====================== BRANDS ======================
  @Get('brands')
  findAllBrands() {
    return this.inventoryService.findAllBrands();
  }

  @Post('brands')
  createBrand(@Body() body: { name: string }) {
    return this.inventoryService.createBrand(body.name);
  }

  @Delete('brands/:id')
  deleteBrand(@Param('id') id: string) {
    return this.inventoryService.deleteBrand(id);
  }
}
