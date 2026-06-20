import { InventoryRequest } from '../models/inventory-request.model';
import { CreateInventoryRequestDto } from '../dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from '../dto/update-inventory-request.dto';
export declare class InventoryRequestService {
    private requestModel;
    constructor(requestModel: typeof InventoryRequest);
    createRequest(dto: CreateInventoryRequestDto): Promise<InventoryRequest>;
    findAllRequests(): Promise<InventoryRequest[]>;
    getRequestsByProject(projectId: string): Promise<InventoryRequest[]>;
    findRequestById(id: string): Promise<InventoryRequest>;
    updateRequest(id: string, dto: UpdateInventoryRequestDto): Promise<InventoryRequest>;
    deleteRequest(id: string): Promise<{
        message: string;
    }>;
    findRequestsByProject(projectId: string): Promise<InventoryRequest[]>;
    getPendingRequests(): Promise<InventoryRequest[]>;
    countByProject(projectId: string): Promise<number>;
    countTotal(): Promise<number>;
}
