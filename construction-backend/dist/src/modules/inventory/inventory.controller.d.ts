import { InventoryService } from './inventory.service';
import { UnitService } from './services/unit.service';
import { BrandService } from './services/brand.service';
import { InventoryRequestService } from './services/inventory-request.service';
import { InventoryDispatchService } from './services/inventory-dispatch.service';
import { ProjectMaterialService } from './services/project-material.service';
import { CreateInventoryRequestDto } from './dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from './dto/update-inventory-request.dto';
import { CreateInventoryDispatchDto } from './dto/create-inventory-dispatch.dto';
import { UpdateInventoryDispatchDto } from './dto/update-inventory-dispatch.dto';
import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';
import { CreateProjectMaterialDto } from './dto/create-material.dto';
import { UpdateProjectMaterialDto } from './dto/update-material';
export declare class InventoryController {
    private readonly inventoryService;
    private readonly unitService;
    private readonly brandService;
    private readonly requestService;
    private readonly dispatchService;
    private readonly projectMaterialService;
    constructor(inventoryService: InventoryService, unitService: UnitService, brandService: BrandService, requestService: InventoryRequestService, dispatchService: InventoryDispatchService, projectMaterialService: ProjectMaterialService);
    createUnit(body: {
        name: string;
        short_name: string;
    }): Promise<import("../boq/models/unit.model").Unit>;
    findAllUnits(): Promise<import("../boq/models/unit.model").Unit[]>;
    findUnitByShortName(shortName: string): Promise<import("../boq/models/unit.model").Unit>;
    findUnit(id: string): Promise<import("../boq/models/unit.model").Unit>;
    updateUnit(id: string, body: {
        name?: string;
        short_name?: string;
    }): Promise<import("../boq/models/unit.model").Unit>;
    deleteUnit(id: string): Promise<{
        message: string;
    }>;
    createRequest(dto: CreateInventoryRequestDto): Promise<import("./models/inventory-request.model").InventoryRequest>;
    findAllRequests(): Promise<import("./models/inventory-request.model").InventoryRequest[]>;
    getPendingRequests(): Promise<import("./models/inventory-request.model").InventoryRequest[]>;
    findRequest(id: string): Promise<import("./models/inventory-request.model").InventoryRequest>;
    updateRequest(id: string, dto: UpdateInventoryRequestDto): Promise<import("./models/inventory-request.model").InventoryRequest>;
    deleteRequest(id: string): Promise<{
        message: string;
    }>;
    getRequestsByProject(projectId: string): Promise<import("./models/inventory-request.model").InventoryRequest[]>;
    createDispatch(dto: CreateInventoryDispatchDto): Promise<import("./models/inventory-dispatch.model").InventoryDispatch>;
    findAllDispatches(): Promise<import("./models/inventory-dispatch.model").InventoryDispatch[]>;
    findDispatch(id: string): Promise<import("./models/inventory-dispatch.model").InventoryDispatch>;
    updateDispatch(id: string, dto: UpdateInventoryDispatchDto): Promise<import("./models/inventory-dispatch.model").InventoryDispatch>;
    deleteDispatch(id: string): Promise<{
        message: string;
    }>;
    createMaster(dto: CreateInventoryMasterDto): Promise<import("./models/inventory-master.model").InventoryMaster>;
    findAllMaster(): Promise<import("./models/inventory-master.model").InventoryMaster[]>;
    searchInventory(query: string): Promise<import("./models/inventory-master.model").InventoryMaster[]>;
    findMaster(id: string): Promise<import("./models/inventory-master.model").InventoryMaster>;
    updateMaster(id: string, dto: UpdateInventoryMasterDto): Promise<import("./models/inventory-master.model").InventoryMaster>;
    deleteMaster(id: string): Promise<{
        message: string;
    }>;
    createProjectMaterial(dto: CreateProjectMaterialDto): Promise<import("./models/project-materials.model").ProjectMaterial>;
    findAllProjectMaterials(): Promise<import("./models/project-materials.model").ProjectMaterial[]>;
    getPendingMaterials(): Promise<import("./models/project-materials.model").ProjectMaterial[]>;
    findProjectMaterial(id: string): Promise<import("./models/project-materials.model").ProjectMaterial>;
    updateProjectMaterial(id: string, dto: UpdateProjectMaterialDto): Promise<import("./models/project-materials.model").ProjectMaterial>;
    deleteProjectMaterial(id: string): Promise<{
        message: string;
    }>;
    findProjectMaterialsByProject(projectId: string): Promise<import("./models/project-materials.model").ProjectMaterial[]>;
    getProjectMaterialSummary(projectId: string): Promise<{
        totalMaterials: number;
        estimatedQty: number;
        requiredQty: number;
        receivedQty: number;
        usedQty: number;
    }>;
    getProjectMaterialStatus(projectId: string): Promise<{
        planned: number;
        ordered: number;
        received: number;
        inUse: number;
        closed: number;
    }>;
    getMaterialConsumption(projectId: string): Promise<{
        id: string;
        itemName: string;
        estimated: number;
        required: number;
        received: number;
        used: number;
        balance: number;
    }[]>;
    getProjectInventoryValue(projectId: string): Promise<{
        projectId: string;
        totalValue: number;
    }>;
    getProjectPendingMaterials(projectId: string): Promise<import("./models/project-materials.model").ProjectMaterial[]>;
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
    createBrand(body: {
        name: string;
    }): Promise<import("./models/brand.model").Brand>;
    findAllBrands(): Promise<import("./models/brand.model").Brand[]>;
    deleteBrand(id: string): Promise<{
        message: string;
    }>;
}
