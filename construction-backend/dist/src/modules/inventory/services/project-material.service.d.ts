import { ProjectMaterial } from '../models/project-materials.model';
import { InventoryRequest } from '../models/inventory-request.model';
import { CreateProjectMaterialDto } from '../dto/create-material.dto';
import { UpdateProjectMaterialDto } from '../dto/update-material';
export declare class ProjectMaterialService {
    private projectMaterialModel;
    private requestModel;
    constructor(projectMaterialModel: typeof ProjectMaterial, requestModel: typeof InventoryRequest);
    createProjectMaterial(dto: CreateProjectMaterialDto): Promise<ProjectMaterial>;
    updateProjectMaterial(id: string, dto: UpdateProjectMaterialDto): Promise<ProjectMaterial>;
    deleteProjectMaterial(id: string): Promise<{
        message: string;
    }>;
    findAllProjectMaterials(): Promise<ProjectMaterial[]>;
    findProjectMaterialsByProject(projectId: string): Promise<ProjectMaterial[]>;
    findProjectMaterialById(id: string): Promise<ProjectMaterial>;
    getProjectMaterialSummary(projectId: string): Promise<{
        totalMaterials: number;
        estimatedQty: number;
        requiredQty: number;
        receivedQty: number;
        usedQty: number;
    }>;
    getProjectInventoryValue(projectId: string): Promise<{
        projectId: string;
        totalValue: number;
    }>;
    getProjectMaterialStatus(projectId: string): Promise<{
        planned: number;
        ordered: number;
        received: number;
        inUse: number;
        closed: number;
    }>;
    getPendingMaterials(projectId?: string): Promise<ProjectMaterial[]>;
    getMaterialConsumption(projectId: string): Promise<{
        id: string;
        itemName: string;
        estimated: number;
        required: number;
        received: number;
        used: number;
        balance: number;
    }[]>;
    countByProject(projectId: string): Promise<number>;
    countTotal(): Promise<number>;
}
