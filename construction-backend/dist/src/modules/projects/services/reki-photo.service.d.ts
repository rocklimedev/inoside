import { RekiPhoto } from '../models/reki_photos.model';
import { Project } from '../models/project.model';
export declare class RekiPhotoService {
    private rekiPhotoModel;
    private projectModel;
    constructor(rekiPhotoModel: typeof RekiPhoto, projectModel: typeof Project);
    add(dto: any): Promise<RekiPhoto>;
    findByReki(reki_report_id: string): Promise<RekiPhoto[]>;
    delete(id: string): Promise<number>;
}
