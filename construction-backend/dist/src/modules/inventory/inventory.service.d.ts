import { InventoryMaster } from './models/inventory-master.model';
import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';
import { BrandService } from './services/brand.service';
import { UnitService } from './services//unit.service';
import { InventoryRequestService } from './services/inventory-request.service';
import { InventoryDispatchService } from './services/inventory-dispatch.service';
import { ProjectMaterialService } from './services/project-material.service';
export declare class InventoryService {
    private masterModel;
    private readonly brandService;
    private readonly unitService;
    private readonly requestService;
    private readonly dispatchService;
    private readonly projectMaterialService;
    constructor(masterModel: typeof InventoryMaster, brandService: BrandService, unitService: UnitService, requestService: InventoryRequestService, dispatchService: InventoryDispatchService, projectMaterialService: ProjectMaterialService);
    createMaster(dto: CreateInventoryMasterDto): Promise<InventoryMaster>;
    findAllMaster(): Promise<InventoryMaster[]>;
    findMasterById(id: string): Promise<InventoryMaster>;
    updateMaster(id: string, dto: UpdateInventoryMasterDto): Promise<InventoryMaster>;
    deleteMaster(id: string): Promise<{
        message: string;
    }>;
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
}
