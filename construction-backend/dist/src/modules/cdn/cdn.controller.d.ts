import { CdnService } from './services/cdn.service';
export declare class CdnController {
    private readonly cdnService;
    constructor(cdnService: CdnService);
    upload(file: Express.Multer.File): Promise<{
        filename: string;
        url: string;
    }>;
}
