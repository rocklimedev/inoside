import { InventoryRequest } from '../models/inventory-request.model';
import { CreateRequestDto } from '../dto/create-request.dto';
export declare class InventoryRequestService {
    private repo;
    constructor(repo: typeof InventoryRequest);
    create(dto: CreateRequestDto, userId: string): Promise<InventoryRequest>;
    approve(id: string, approvedBy: string): Promise<InventoryRequest>;
    getAll(): Promise<InventoryRequest[]>;
}
