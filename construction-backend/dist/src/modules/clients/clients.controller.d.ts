import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto, req: any): Promise<import("./models/client.model").Client>;
    findAll(req: any): Promise<import("./models/client.model").Client[]>;
    findOne(id: string, req: any): Promise<import("./models/client.model").Client>;
    update(id: string, dto: UpdateClientDto, req: any): Promise<import("./models/client.model").Client>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
