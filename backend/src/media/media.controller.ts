import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
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
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async upload(@UploadedFile() file: UploadedFileDto) {
    return this.mediaService.create(file);
  }

  @Get()
  @ApiOperation({ summary: 'List all media' })
  @ApiResponse({ status: 200, description: 'List of media items' })
  async list() {
    return this.mediaService.findAll();
  }

  @Get('files/:id')
  @ApiOperation({ summary: 'Serve media file' })
  @ApiResponse({ status: 200, description: 'File stream' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async serve(
    @Param('id') id: string,
    @Res({ passthrough: false }) res: Response,
  ): Promise<void> {
    const { absolutePath, mimeType } = await this.mediaService.getFilePath(id);
    const stream = fs.createReadStream(absolutePath);
    res.setHeader('Content-Type', mimeType);
    stream.pipe(res);
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
