import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
export declare class SitesController {
    private readonly sitesService;
    constructor(sitesService: SitesService);
    create(createSiteDto: CreateSiteDto): Promise<import("./models/site.model").Site | null>;
    findAll(): Promise<import("./models/site.model").Site[]>;
    findByClient(clientId: string): Promise<import("./models/site.model").Site[]>;
    findOne(id: string): Promise<import("./models/site.model").Site>;
    update(id: string, updateSiteDto: UpdateSiteDto): Promise<import("./models/site.model").Site>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
