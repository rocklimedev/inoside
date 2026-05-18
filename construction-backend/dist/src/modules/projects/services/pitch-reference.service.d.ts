import { PitchReference } from '../models/pitch_references.model';
import { Project } from '../models/project.model';
export declare class PitchReferenceService {
    private pitchRefModel;
    private projectModel;
    constructor(pitchRefModel: typeof PitchReference, projectModel: typeof Project);
    add(dto: any): Promise<PitchReference>;
    findByProject(project_id: string): Promise<PitchReference[]>;
    delete(id: string): Promise<number>;
}
