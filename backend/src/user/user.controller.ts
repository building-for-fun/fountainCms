import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';
import { User, Prisma } from '../generated/prisma/client';
import { UserDetailsDto } from './user-details.model';

type RequestWithUser = Request & { user?: { sub: string } };

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  private getActor(req: RequestWithUser) {
    return {
      userId: req.user?.sub ?? null,
      ip:
        (req.ip as string) ??
        (req.headers['x-forwarded-for'] as string) ??
        null,
      userAgent: (req.headers['user-agent'] as string) ?? null,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [UserDetailsDto],
  })
  async getAll(): Promise<{ data: User[] }> {
    try {
      const users = await this.userService.getAll();
      return { data: users ?? [] };
    } catch (error) {
      this.logger.error('🔥 Failed to fetch users', error);

      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
    type: UserDetailsDto,
  })
  async getById(@Param('id') id: string): Promise<User | null> {
    try {
      return await this.userService.getById(id);
    } catch (error) {
      this.logger.error(`🔥 Failed to fetch user ${id}`, error);

      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDetailsDto,
  })
  async create(
    @Body() body: Prisma.UserCreateInput,
    @Req() req: RequestWithUser,
  ): Promise<User> {
    try {
      return await this.userService.create(body, this.getActor(req));
    } catch (error) {
      this.logger.error('🔥 Failed to create user', error);

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UserDetailsDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserDetailsDto,
  })
  async update(
    @Param('id') id: string,
    @Body() body: UserDetailsDto,
    @Req() req: RequestWithUser,
  ): Promise<User> {
    try {
      const { role, ...rest } = body;
      const userData: Prisma.UserUpdateInput = {
        firstName: rest.firstName,
        lastName: rest.lastName,
        email: rest.email,
        username: rest.username,
      };
      if (rest.isActive !== undefined) userData.isActive = rest.isActive;

      let roleName: string | null | undefined = undefined;
      if (typeof role === 'string' || role === null) {
        roleName = role;
      } else if (role && typeof role === 'object' && 'name' in role) {
        roleName = (role as { name: string | null }).name;
      }

      return await this.userService.update(
        id,
        { data: userData, roleName },
        this.getActor(req),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`🔥 Failed to update user ${id} - ${message}`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to update user',
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async delete(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean }> {
    try {
      const ok = await this.userService.delete(id, this.getActor(req));
      return { success: ok };
    } catch (error) {
      this.logger.error(`🔥 Failed to delete user ${id}`, error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
