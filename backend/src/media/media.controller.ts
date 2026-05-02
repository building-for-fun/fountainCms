import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateMediaFolderDto,
  UpdateMediaFolderDto,
} from './dto/media-folder.dto';
import { MediaServeAuthGuard } from './media-serve-auth.guard';
import { MediaService } from './media.service';
import { UploadedFileDto } from './media.types';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a media file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folderId: {
          type: 'string',
          format: 'uuid',
          description: 'Optional media folder',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async upload(
    @UploadedFile() file: UploadedFileDto,
    @Body('folderId') folderId?: string,
  ) {
    return this.mediaService.create(file, folderId);
  }

  @Get('folders')
  @ApiOperation({ summary: 'List media folders' })
  async listFolders() {
    return this.mediaService.listFolders();
  }

  @Post('folders')
  @ApiOperation({ summary: 'Create a media folder' })
  async createFolder(@Body() dto: CreateMediaFolderDto) {
    return this.mediaService.createFolder(dto);
  }

  @Patch('folders/:folderId')
  @ApiOperation({ summary: 'Rename a media folder' })
  async updateFolder(
    @Param('folderId') folderId: string,
    @Body() dto: UpdateMediaFolderDto,
  ) {
    return this.mediaService.updateFolder(folderId, dto);
  }

  @Delete('folders/:folderId')
  @ApiOperation({ summary: 'Delete an empty media folder' })
  async deleteFolder(@Param('folderId') folderId: string): Promise<void> {
    await this.mediaService.deleteFolder(folderId);
  }

  @Public()
  @UseGuards(MediaServeAuthGuard)
  @Get('files/:id')
  @ApiOperation({
    summary: 'Serve media file (original or transformed image)',
    description:
      'Images: optional w, h, fit (cover|contain|inside|fill), format (jpeg|png|webp|avif), q (1–100). When MEDIA_URL_SIGNING_SECRET is set, anonymous access requires exp (unix sec) and sig (HMAC-SHA256 hex of `{id}|{exp}|{canonicalTransformQuery}`).',
  })
  @ApiQuery({ name: 'w', required: false })
  @ApiQuery({ name: 'h', required: false })
  @ApiQuery({
    name: 'fit',
    required: false,
    enum: ['cover', 'contain', 'inside', 'fill'],
  })
  @ApiQuery({ name: 'format', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({
    name: 'exp',
    required: false,
    description: 'Signature expiry (unix seconds)',
  })
  @ApiQuery({ name: 'sig', required: false, description: 'HMAC-SHA256 hex' })
  @ApiResponse({ status: 200, description: 'File stream' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async serve(
    @Param('id') id: string,
    @Query() query: Record<string, string | string[] | undefined>,
    @Res({ passthrough: false }) res: Response,
  ): Promise<void> {
    const { absolutePath, mimeType, cacheControl } =
      await this.mediaService.serveFile(id, query);
    res.setHeader('Content-Type', mimeType);
    if (cacheControl) {
      res.setHeader('Cache-Control', cacheControl);
    }
    const stream = fs.createReadStream(absolutePath);
    stream.pipe(res);
  }

  @Get()
  @ApiOperation({ summary: 'List all media' })
  @ApiQuery({
    name: 'folderId',
    required: false,
    description: 'Filter by folder UUID',
  })
  @ApiResponse({ status: 200, description: 'List of media items' })
  async list(@Query('folderId') folderId?: string) {
    return this.mediaService.findAll(folderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media metadata' })
  @ApiResponse({ status: 200, description: 'Media metadata' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    await this.mediaService.delete(id);
    return { deleted: true };
  }
}
