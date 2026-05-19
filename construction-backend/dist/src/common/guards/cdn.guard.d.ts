import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CdnGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
