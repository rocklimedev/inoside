import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
  ParseEnumPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =============================================
  // CREATE USER
  // =============================================
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return {
      success: true,
      message: 'User created successfully',
      data: this.sanitizeUser(user),
    };
  }

  // =============================================
  // GET ALL USERS
  // =============================================
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async findAll(
    @Query('role', new ParseEnumPipe(UserRole, { optional: true }))
    role?: UserRole,
  ) {
    const users = role
      ? await this.usersService.findByRole(role)
      : await this.usersService.findAll();

    return {
      success: true,
      count: users.length,
      data: users.map((user) => this.sanitizeUser(user)),
    };
  }

  // =============================================
  // GET PROFILE (CURRENT USER)
  // =============================================
  @Get('profile')
  @Roles(...Object.values(UserRole))
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);

    return {
      success: true,
      data: this.sanitizeUser(user),
    };
  }

  // =============================================
  // GET USER BY ID
  // =============================================
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async findOne(@Param('id') id: string, @Request() req) {
    // Allow self-access OR admin
    if (req.user.id !== id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.usersService.findOne(id);

    return {
      success: true,
      data: this.sanitizeUser(user),
    };
  }

  // =============================================
  // UPDATE USER
  // =============================================
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    let updateData = { ...updateUserDto };

    // Restrict non-admin users updating themselves
    if (req.user.id === id && req.user.role !== UserRole.ADMIN) {
      delete (updateData as any).role;
      delete (updateData as any).is_active;
    }

    const updatedUser = await this.usersService.update(id, updateData);

    return {
      success: true,
      message: 'User updated successfully',
      data: this.sanitizeUser(updatedUser),
    };
  }

  // =============================================
  // SOFT DELETE USER
  // =============================================
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.usersService.softDelete(id);

    return {
      success: true,
      message: 'User has been deactivated successfully',
    };
  }

  // =============================================
  // ACTIVATE USER
  // =============================================
  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  async activate(@Param('id') id: string) {
    const user = await this.usersService.activateUser(id);

    return {
      success: true,
      message: 'User activated successfully',
      data: this.sanitizeUser(user),
    };
  }

  // =============================================
  // PRIVATE HELPER
  // =============================================
  private sanitizeUser(user: any) {
    const { password_hash, ...rest } = user;
    return rest;
  }
}
