import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiTokensService } from './api-tokens.service';
import { CreateApiTokenDto } from './dto/create-api-token.dto';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';

@ApiTags('api-tokens')
@ApiBearerAuth()
@Controller('api-tokens')
@UseGuards(SuperAdminGuard)
export class ApiTokensController {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  @Post()
  @ApiOperation({
    summary: 'Create API token (Super Admin only)',
    description:
      'Returns the secret once. Use Authorization: Bearer <token> or X-Api-Key header on Content API.',
  })
  @ApiResponse({
    status: 201,
    description: 'Token created; plain secret in body',
  })
  async create(@Body() dto: CreateApiTokenDto) {
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    const { plainToken, token } = await this.apiTokensService.create(
      dto.name,
      dto.permissions,
      expiresAt,
    );
    return {
      token: plainToken,
      meta: token,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List API tokens (metadata only)' })
  async list() {
    const items = await this.apiTokensService.findAll();
    return { data: items };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Revoke API token' })
  async revoke(@Param('id') id: string) {
    const ok = await this.apiTokensService.revoke(id);
    if (!ok) {
      throw new NotFoundException();
    }
  }
}
