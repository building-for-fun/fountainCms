import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleDetails } from './role-details.model'; // Role entity model, adjust path if needed
import { RolesService } from './roles.service';

@ApiTags('roles') // Groups these endpoints under 'roles' tag in Swagger UI
@Controller('api/roles') // Base route for roles API
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * GET /api/roles
   * Retrieves a list of all roles.
   */
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all roles',
    type: RoleDetails,
    isArray: true,
  })
  getAll(): { data: RoleDetails[] } {
    return { data: this.rolesService.getAll() };
  }

  /**
   * POST /api/roles
   * Creates a new role using partial RoleDetails.
   */
  @Post()
  @HttpCode(201) // HTTP 201 Created
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: RoleDetails }) // Request body schema
  @ApiResponse({
    status: 201,
    description: 'The created role',
    type: RoleDetails,
  })
  create(@Body() body: Partial<RoleDetails>): RoleDetails {
    return this.rolesService.create(body);
  }

  /**
   * GET /api/roles/:id
   * Retrieves a role by its ID.
   * Throws 404 if role not found.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'The role with the specified ID',
    type: RoleDetails,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  getById(@Param('id') id: string): RoleDetails {
    const role = this.rolesService.getById(id);
    if (!role) throw new NotFoundException('Not found');
    return role;
  }

  /**
   * PUT /api/roles/:id
   * Updates a role partially by ID.
   * Throws 404 if role not found.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ type: RoleDetails }) // Request body schema
  @ApiResponse({
    status: 200,
    description: 'The updated role',
    type: RoleDetails,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(
    @Param('id') id: string,
    @Body() body: Partial<RoleDetails>,
  ): RoleDetails {
    const role = this.rolesService.update(id, body);
    if (!role) throw new NotFoundException('Not found');
    return role;
  }

  /**
   * DELETE /api/roles/:id
   * Deletes a role by ID.
   * Returns HTTP 204 No Content on success.
   * Throws 404 if role not found.
   */
  @Delete(':id')
  @HttpCode(204) // HTTP 204 No Content
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  delete(@Param('id') id: string): void {
    const deleted = this.rolesService.delete(id);
    if (!deleted) throw new NotFoundException('Not found');
  }
}
