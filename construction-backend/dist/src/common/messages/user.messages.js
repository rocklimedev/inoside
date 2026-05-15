"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_MESSAGES = void 0;
exports.USER_MESSAGES = {
    NOT_FOUND: (id) => `User with ID ${id} not found`,
    EMAIL_EXISTS: 'User with this email already exists',
    EMAIL_IN_USE: 'Email already in use',
    INVALID_ROLE: 'Invalid role_id provided',
    NO_PERMISSION: 'You do not have permission to perform this action',
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    TOGGLED: 'User status updated successfully',
};
//# sourceMappingURL=user.messages.js.map