export declare class CdnService {
    uploadFile(file: Express.Multer.File): Promise<{
        filename: string;
        url: string;
    }>;
}
