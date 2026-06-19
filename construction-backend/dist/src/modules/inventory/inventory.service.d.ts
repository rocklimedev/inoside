import { InventoryRequest } from './models/inventory-request.model';
import { InventoryDispatch } from './models/inventory-dispatch.model';
import { InventoryMaster } from './models/inventory-master.model';
import { ProjectMaterial } from './models/project-materials.model';
import { Brand } from './models/brand.model';
import { Unit } from '../boq/models/unit.model';
import { CreateInventoryRequestDto } from './dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from './dto/update-inventory-request.dto';
import { CreateInventoryDispatchDto } from './dto/create-inventory-dispatch.dto';
import { UpdateInventoryDispatchDto } from './dto/update-inventory-dispatch.dto';
import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';
import { CreateProjectMaterialDto } from './dto/create-material.dto';
import { UpdateProjectMaterialDto } from './dto/update-material';
export declare class InventoryService {
    private requestModel;
    private dispatchModel;
    private masterModel;
    private projectMaterialModel;
    private brandModel;
    private unitModel;
    constructor(requestModel: typeof InventoryRequest, dispatchModel: typeof InventoryDispatch, masterModel: typeof InventoryMaster, projectMaterialModel: typeof ProjectMaterial, brandModel: typeof Brand, unitModel: typeof Unit);
    createUnit(name: string, shortName: string): Promise<Unit>;
    findAllUnits(): Promise<Unit[]>;
    findUnitById(id: string): Promise<Unit>;
    findUnitByShortName(shortName: string): Promise<Unit>;
    updateUnit(id: string, name?: string, shortName?: string): Promise<Unit>;
    deleteUnit(id: string): Promise<{
        message: string;
    }>;
    createRequest(dto: CreateInventoryRequestDto): Promise<InventoryRequest>;
    findAllRequests(): Promise<InventoryRequest[]>;
    getRequestsByProject(projectId: string): Promise<InventoryRequest[]>;
    findRequestById(id: string): Promise<InventoryRequest>;
    updateRequest(id: string, dto: UpdateInventoryRequestDto): Promise<InventoryRequest>;
    deleteRequest(id: string): Promise<{
        message: string;
    }>;
    createDispatch(dto: CreateInventoryDispatchDto): Promise<InventoryDispatch>;
    findAllDispatches(): Promise<InventoryDispatch[]>;
    findDispatchById(id: string): Promise<InventoryDispatch>;
    updateDispatch(id: string, dto: UpdateInventoryDispatchDto): Promise<InventoryDispatch>;
    deleteDispatch(id: string): Promise<{
        message: string;
    }>;
    createMaster(dto: CreateInventoryMasterDto): Promise<InventoryMaster>;
    findAllMaster(): Promise<InventoryMaster[]>;
    findMasterById(id: string): Promise<InventoryMaster>;
    updateMaster(id: string, dto: UpdateInventoryMasterDto): Promise<InventoryMaster>;
    deleteMaster(id: string): Promise<{
        message: string;
    }>;
    createProjectMaterial(dto: CreateProjectMaterialDto): Promise<ProjectMaterial>;
    updateProjectMaterial(id: string, dto: UpdateProjectMaterialDto): Promise<ProjectMaterial>;
    deleteProjectMaterial(id: string): Promise<{
        message: string;
    }>;
    findAllProjectMaterials(): Promise<ProjectMaterial[]>;
    findProjectMaterialsByProject(projectId: string): Promise<ProjectMaterial[]>;
    findProjectMaterialById(id: string): Promise<ProjectMaterial>;
    getProjectMaterialSummary(projectId: string): Promise<{
        totalMaterials: number;
        estimatedQty: number;
        requiredQty: number;
        receivedQty: number;
        usedQty: number;
    }>;
    getProjectInventoryValue(projectId: string): Promise<{
        projectId: string;
        totalValue: number;
    }>;
    getProjectMaterialStatus(projectId: string): Promise<{
        planned: number;
        ordered: number;
        received: number;
        inUse: number;
        closed: number;
    }>;
    getPendingMaterials(projectId?: string): Promise<ProjectMaterial[]>;
    getMaterialConsumption(projectId: string): Promise<{
        id: string;
        itemName: string;
        estimated: number;
        required: number;
        received: number;
        used: number;
        balance: number;
    }[]>;
    findRequestsByProject(projectId: string): Promise<InventoryRequest[]>;
    getPendingRequests(): Promise<InventoryRequest[]>;
    findDispatchesByProject(projectId: string): Promise<InventoryDispatch[]>;
    searchInventory(query: string): Promise<InventoryMaster[]>;
    getInventoryByCategory(categoryId: string): Promise<InventoryMaster[]>;
    getInventoryByBrand(brandId: string): Promise<InventoryMaster[]>;
    getInventoryDashboard(): Promise<{
        totalItems: number;
        totalBrands: number;
        totalUnits: number;
        totalRequests: number;
        totalDispatches: number;
        totalProjectMaterials: number;
    }>;
    getProjectInventoryDashboard(projectId: string): Promise<{
        projectId: string;
        materials: number;
        requests: number;
        dispatches: number;
    }>;
    findAllBrands(): Promise<Brand[]>;
    createBrand(name: string): Promise<Brand>;
    deleteBrand(id: string): Promise<{
        message: string;
    }>;
}
