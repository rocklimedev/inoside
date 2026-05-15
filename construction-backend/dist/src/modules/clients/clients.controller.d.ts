import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto): Promise<import("./models/client.model").Client>;
    findAll(): Promise<import("./models/client.model").Client[]>;
    findOne(id: string): Promise<import("./models/client.model").Client>;
    update(id: string, dto: UpdateClientDto): Promise<import("./models/client.model").Client>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
