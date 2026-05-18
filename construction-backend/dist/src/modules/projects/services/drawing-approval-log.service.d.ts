import { DrawingApprovalLog } from '../models/drawing_approval_logs.model';
export declare class DrawingApprovalLogService {
    private approvalLogModel;
    constructor(approvalLogModel: typeof DrawingApprovalLog);
    create(dto: any): Promise<DrawingApprovalLog>;
    findByDrawing(drawing_id: string): Promise<DrawingApprovalLog[]>;
}
