import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { catalogEntries } from './extension-catalog';
import { ENABLED_EXTENSION_IDS } from './extensions.constants';

@ApiTags('extensions')
@ApiBearerAuth()
@Controller('extensions')
@UseGuards(SuperAdminGuard)
export class ExtensionsController {
  constructor(
    @Inject(ENABLED_EXTENSION_IDS)
    private readonly enabledExtensionIds: string[],
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List built-in extensions (Super Admin)',
    description:
      'Shows catalog entries from EXTENSION_CATALOG and whether each is loaded via EXTENSIONS_ENABLED.',
  })
  list() {
    const enabled = new Set(
      this.enabledExtensionIds.map((s) => s.trim()).filter(Boolean),
    );
    return {
      data: catalogEntries().map((e) => ({
        id: e.id,
        description: e.description,
        loaded: enabled.has(e.id),
      })),
    };
  }
}
