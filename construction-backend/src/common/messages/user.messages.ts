export const USER_MESSAGES = {
  NOT_FOUND: (id: string) => `User with ID ${id} not found`,

  EMAIL_EXISTS: 'User with this email already exists',

  EMAIL_IN_USE: 'Email already in use',

  INVALID_ROLE: 'Invalid role_id provided',

  NO_PERMISSION: 'You do not have permission to perform this action',

  CREATED: 'User created successfully',
  UPDATED: 'User updated successfully',
  DELETED: 'User deleted successfully',

  TOGGLED: 'User status updated successfully',
};
