import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
export declare class SitesController {
    private readonly sitesService;
    constructor(sitesService: SitesService);
    create(createSiteDto: CreateSiteDto): Promise<import("./models/site.model").Site>;
    findAll(): Promise<import("./models/site.model").Site[]>;
    findOne(id: number): Promise<import("./models/site.model").Site>;
    update(id: number, updateSiteDto: UpdateSiteDto): Promise<import("./models/site.model").Site>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
