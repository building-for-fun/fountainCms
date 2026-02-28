import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { UploadedFileDto } from './media.types';

const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/', 'application/pdf'];

@Injectable()
export class MediaService implements OnModuleInit {
  private uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const dir =
      this.config.get<string>('MEDIA_UPLOAD_PATH') ||
      this.config.get<string>('UPLOAD_PATH') ||
      'uploads';
    this.uploadDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
  }

  async onModuleInit(): Promise<void> {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private isAllowedMime(mimeType: string): boolean {
    return ALLOWED_MIME_PREFIXES.some((p) =>
      mimeType.toLowerCase().startsWith(p),
    );
  }

  private safeJoin(...segments: string[]): string {
    const resolved = path.join(...segments);
    const normalized = path.normalize(resolved);
    if (!normalized.startsWith(path.normalize(this.uploadDir))) {
      throw new BadRequestException('Invalid path');
    }
    return normalized;
  }

  async create(
    file: UploadedFileDto,
  ): Promise<{
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
  }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }
    const mimeType = file.mimetype || 'application/octet-stream';
    if (!this.isAllowedMime(mimeType)) {
      throw new BadRequestException(
        `File type not allowed. Allowed: ${ALLOWED_MIME_PREFIXES.join(', ')}`,
      );
    }

    const ext =
      path.extname(file.originalname ?? '') ||
      this.getExtensionFromMime(mimeType);
    const subdir = path.join(
      new Date().getUTCFullYear().toString(),
      (new Date().getUTCMonth() + 1).toString().padStart(2, '0'),
    );
    const dirPath = path.join(this.uploadDir, subdir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const id = crypto.randomUUID();
    const filename = `${id}${ext}`;
    const relativePath = path.join(subdir, filename);
    const absolutePath = path.join(this.uploadDir, relativePath);

    fs.writeFileSync(absolutePath, file.buffer);

    const record = await this.prisma.media.create({
      data: {
        filename,
        originalName: file.originalname ?? filename,
        mimeType,
        size: file.size,
        path: relativePath,
      },
    });

    const baseUrl = this.config.get<string>('API_BASE_URL') || '';
    const url = baseUrl
      ? `${baseUrl.replace(/\/$/, '')}/api/media/files/${record.id}`
      : `/api/media/files/${record.id}`;

    return {
      id: record.id,
      url,
      filename: record.originalName,
      mimeType: record.mimeType,
      size: record.size,
    };
  }

  private getExtensionFromMime(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'application/pdf': '.pdf',
    };
    return map[mimeType] || '';
  }

  async findAll(): Promise<
    Array<{
      id: string;
      url: string;
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      createdAt: Date;
    }>
  > {
    const baseUrl = this.config.get<string>('API_BASE_URL') || '';
    const items = await this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items.map((m) => ({
      id: m.id,
      url: baseUrl
        ? `${baseUrl.replace(/\/$/, '')}/api/media/files/${m.id}`
        : `/api/media/files/${m.id}`,
      filename: m.filename,
      originalName: m.originalName,
      mimeType: m.mimeType,
      size: m.size,
      createdAt: m.createdAt,
    }));
  }

  async findOne(id: string): Promise<{
    id: string;
    url: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    createdAt: Date;
  }> {
    const record = await this.prisma.media.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException('Media not found');
    }
    const baseUrl = this.config.get<string>('API_BASE_URL') || '';
    return {
      id: record.id,
      url: baseUrl
        ? `${baseUrl.replace(/\/$/, '')}/api/media/files/${record.id}`
        : `/api/media/files/${record.id}`,
      filename: record.filename,
      originalName: record.originalName,
      mimeType: record.mimeType,
      size: record.size,
      createdAt: record.createdAt,
    };
  }

  getFilePath(id: string): Promise<{ absolutePath: string; mimeType: string }> {
    return this.prisma.media.findUnique({ where: { id } }).then((record) => {
      if (!record) {
        throw new NotFoundException('Media not found');
      }
      const absolutePath = this.safeJoin(this.uploadDir, record.path);
      if (!fs.existsSync(absolutePath)) {
        throw new NotFoundException('Media file not found on disk');
      }
      return { absolutePath, mimeType: record.mimeType };
    });
  }

  async delete(id: string): Promise<void> {
    const record = await this.prisma.media.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException('Media not found');
    }
    const absolutePath = this.safeJoin(this.uploadDir, record.path);
    await this.prisma.media.delete({ where: { id } });
    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch {
      // best-effort; record already removed
    }
  }
}
