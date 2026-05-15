import { PreferredCommunication } from '@/common/enums';
export declare class CreateClientDto {
    name: string;
    contact_number: string;
    email?: string;
    preferred_communication?: PreferredCommunication;
    is_owner?: boolean;
    representative_involved?: boolean;
    representative_comment?: string;
}
