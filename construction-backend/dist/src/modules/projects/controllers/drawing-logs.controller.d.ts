import { DrawingApprovalLogService } from '../services/drawing-approval-log.service';
export declare class DrawingLogsController {
    private readonly approvalLogService;
    constructor(approvalLogService: DrawingApprovalLogService);
    addLog(drawingId: string, dto: any): Promise<import("../models/drawing_approval_logs.model").DrawingApprovalLog>;
    getLogs(drawingId: string): Promise<import("../models/drawing_approval_logs.model").DrawingApprovalLog[]>;
}
