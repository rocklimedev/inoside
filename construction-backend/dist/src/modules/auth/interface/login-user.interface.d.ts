import { AuthUserResponse } from './auth-user.interface';
export interface LoginResponse {
    access_token: string;
    user: AuthUserResponse;
}
