export declare class UpdateBoqStatusDto {
    status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'revised';
    approved_by?: string;
}
