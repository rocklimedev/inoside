import { CdnEngagementService } from '@/modules/engagement/services/cdn-engagement.service';
export declare class CdnService {
    private readonly cdnEngagementService;
    constructor(cdnEngagementService: CdnEngagementService);
    uploadFile(file: Express.Multer.File, actor?: {
        id: string;
        name: string;
    }): Promise<{
        filename: string;
        url: string;
    }>;
}
