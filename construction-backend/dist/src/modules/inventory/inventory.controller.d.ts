import { InventoryService } from './inventory.service';
import { CreateInventoryDispatchDto } from './dto/create-inventory-dispatch.dto';
import { CreateInventoryRequestDto } from './dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from './dto/update-inventory-request.dto';
import { UpdateInventoryDispatchDto } from './dto/update-inventory-dispatch.dto';
import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createRequest(dto: CreateInventoryRequestDto): Promise<import("./models/inventory-request.model").InventoryRequest>;
    findAllRequests(): Promise<import("./models/inventory-request.model").InventoryRequest[]>;
    findRequest(id: string): Promise<import("./models/inventory-request.model").InventoryRequest>;
    updateRequest(id: string, dto: UpdateInventoryRequestDto): Promise<import("./models/inventory-request.model").InventoryRequest>;
    deleteRequest(id: string): Promise<void>;
    createDispatch(dto: CreateInventoryDispatchDto): Promise<import("./models/inventory-dispatch.model").InventoryDispatch>;
    findAllDispatches(): Promise<import("./models/inventory-dispatch.model").InventoryDispatch[]>;
    updateDispatch(id: string, dto: UpdateInventoryDispatchDto): Promise<import("./models/inventory-dispatch.model").InventoryDispatch>;
    createMaster(dto: CreateInventoryMasterDto): Promise<import("./models/inventory-master.model").InventoryMaster>;
    findAllMaster(): Promise<import("./models/inventory-master.model").InventoryMaster[]>;
    updateMaster(id: string, dto: UpdateInventoryMasterDto): Promise<import("./models/inventory-master.model").InventoryMaster>;
    deleteMaster(id: string): Promise<void>;
    findMaterials(): Promise<import("./models/materials.model").Material[]>;
}
