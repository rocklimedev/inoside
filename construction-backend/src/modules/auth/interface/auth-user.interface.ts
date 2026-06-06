import { Role } from '@/modules/rbac/models/role.model';
export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role | null;

  is_active: boolean;
  is_email_verified: boolean;

  // Avatar fields
  avatar_url?: string | null;
  avatar_thumbnail?: string | null;

  // Optional fields
  last_login?: Date | null;
}
