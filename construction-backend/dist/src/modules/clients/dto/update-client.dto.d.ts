import { PreferredCommunication } from '@/common/enums';
export declare class UpdateClientDto {
    name?: string;
    contact_number?: string;
    email?: string;
    preferred_communication?: PreferredCommunication;
    representative_involved?: boolean;
    representative_comment?: string;
}
