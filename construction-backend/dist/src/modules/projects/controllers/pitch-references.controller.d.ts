import { PitchReferenceService } from '../services/pitch-reference.service';
export declare class PitchReferencesController {
    private readonly pitchRefService;
    constructor(pitchRefService: PitchReferenceService);
    addReference(projectId: string, dto: any): Promise<import("../models/pitch_references.model").PitchReference>;
    getReferences(projectId: string): Promise<import("../models/pitch_references.model").PitchReference[]>;
    deleteReference(refId: string): Promise<number>;
}
