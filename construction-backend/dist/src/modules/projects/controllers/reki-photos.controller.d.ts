import { RekiPhotoService } from '../services/reki-photo.service';
export declare class RekiPhotosController {
    private readonly rekiPhotoService;
    constructor(rekiPhotoService: RekiPhotoService);
    addPhoto(projectId: string, dto: any): Promise<import("../models/reki_photos.model").RekiPhoto>;
    deletePhoto(photoId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
