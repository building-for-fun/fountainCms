import { randomUUID } from 'node:crypto';
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
import type {
  CreateMediaFolderDto,
  UpdateMediaFolderDto,
} from './dto/media-folder.dto';
import { UploadedFileDto } from './media.types';
import {
  outputMimeFromParsedTransform,
  parseMediaTransformQuery,
  renderImageTransform,
  transformCacheFileName,
} from './media-transform.util';

const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/', 'application/pdf'];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    const cacheDir = path.join(this.uploadDir, '.cache', 'media-transforms');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
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

  private parseOptionalFolderId(raw: unknown): string | undefined {
    if (raw === undefined || raw === null || raw === '') return undefined;
    const s = String(raw).trim();
    if (!UUID_RE.test(s)) {
      throw new BadRequestException('folderId must be a valid UUID');
    }
    return s;
  }

  private mediaPublicUrl(recordId: string): string {
    const baseUrl = this.config.get<string>('API_BASE_URL') || '';
    return baseUrl
      ? `${baseUrl.replace(/\/$/, '')}/api/media/files/${recordId}`
      : `/api/media/files/${recordId}`;
  }

  private mapMedia(record: {
    id: string;
    folderId: string | null;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    createdAt: Date;
  }) {
    return {
      id: record.id,
      folderId: record.folderId,
      url: this.mediaPublicUrl(record.id),
      filename: record.filename,
      originalName: record.originalName,
      mimeType: record.mimeType,
      size: record.size,
      createdAt: record.createdAt,
    };
  }

  async create(
    file: UploadedFileDto,
    folderIdRaw?: string,
  ): Promise<{
    id: string;
    folderId: string | null;
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

    const folderId = this.parseOptionalFolderId(folderIdRaw);
    if (folderId) {
      const folder = await this.prisma.mediaFolder.findUnique({
        where: { id: folderId },
      });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
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

    const id = randomUUID();
    const filename = `${id}${ext}`;
    const relativePath = path.join(subdir, filename);
    const absolutePath = path.join(this.uploadDir, relativePath);

    fs.writeFileSync(absolutePath, file.buffer);

    const record = await this.prisma.media.create({
      data: {
        folderId: folderId ?? null,
        filename,
        originalName: file.originalname ?? filename,
        mimeType,
        size: file.size,
        path: relativePath,
      },
    });

    return {
      id: record.id,
      folderId: record.folderId,
      url: this.mediaPublicUrl(record.id),
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

  async findAll(folderIdRaw?: string): Promise<
    Array<{
      id: string;
      folderId: string | null;
      url: string;
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      createdAt: Date;
    }>
  > {
    const folderId = this.parseOptionalFolderId(folderIdRaw);
    const items = await this.prisma.media.findMany({
      where: folderId !== undefined ? { folderId } : {},
      orderBy: { createdAt: 'desc' },
    });
    return items.map((m) => this.mapMedia(m));
  }

  async findOne(id: string): Promise<{
    id: string;
    folderId: string | null;
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
    return this.mapMedia(record);
  }

  /**
   * Resolved file on disk and MIME type (original or transformed cache).
   */
  async serveFile(
    id: string,
    query: Record<string, string | string[] | undefined>,
  ): Promise<{
    absolutePath: string;
    mimeType: string;
    cacheControl?: string;
  }> {
    const record = await this.prisma.media.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException('Media not found');
    }
    const absolutePath = this.safeJoin(this.uploadDir, record.path);
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Media file not found on disk');
    }

    const maxEdgeRaw =
      this.config.get<string>('MEDIA_TRANSFORM_MAX_EDGE') ?? '2048';
    const maxEdge = parseInt(maxEdgeRaw, 10);
    const safeMax =
      Number.isFinite(maxEdge) && maxEdge > 0 ? Math.min(maxEdge, 8192) : 2048;

    const transform = parseMediaTransformQuery(query, safeMax);

    if (!transform) {
      return { absolutePath, mimeType: record.mimeType };
    }

    if (!record.mimeType.toLowerCase().startsWith('image/')) {
      throw new BadRequestException(
        'Image transform query params (w, h, format, …) apply to images only',
      );
    }

    const stat = fs.statSync(absolutePath);
    const cacheName = transformCacheFileName(id, stat.mtimeMs, transform);
    const cacheDir = path.join(this.uploadDir, '.cache', 'media-transforms');
    fs.mkdirSync(cacheDir, { recursive: true });
    const cachePath = path.join(cacheDir, cacheName);

    if (!fs.existsSync(cachePath)) {
      const { buffer } = await renderImageTransform(
        absolutePath,
        record.mimeType,
        transform,
      );
      fs.writeFileSync(cachePath, buffer);
    }

    const mimeType = outputMimeFromParsedTransform(transform, record.mimeType);

    return {
      absolutePath: cachePath,
      mimeType,
      cacheControl: 'public, max-age=31536000, immutable',
    };
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

  async listFolders() {
    return this.prisma.mediaFolder.findMany({
      orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
      },
    });
  }

  async createFolder(dto: CreateMediaFolderDto) {
    const name = dto.name.trim();
    if (!name) {
      throw new BadRequestException('Folder name is required');
    }
    if (dto.parentId) {
      const parent = await this.prisma.mediaFolder.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent folder not found');
      }
    }
    return this.prisma.mediaFolder.create({
      data: { name, parentId: dto.parentId ?? null },
      select: { id: true, name: true, parentId: true, createdAt: true },
    });
  }

  async updateFolder(folderId: string, dto: UpdateMediaFolderDto) {
    const existing = await this.prisma.mediaFolder.findUnique({
      where: { id: folderId },
    });
    if (!existing) {
      throw new NotFoundException('Folder not found');
    }
    const data: { name?: string } = {};
    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (!name) throw new BadRequestException('Folder name is required');
      data.name = name;
    }
    if (Object.keys(data).length === 0) {
      return {
        id: existing.id,
        name: existing.name,
        parentId: existing.parentId,
        createdAt: existing.createdAt,
      };
    }
    return this.prisma.mediaFolder.update({
      where: { id: folderId },
      data,
      select: { id: true, name: true, parentId: true, createdAt: true },
    });
  }

  async deleteFolder(folderId: string): Promise<void> {
    const existing = await this.prisma.mediaFolder.findUnique({
      where: { id: folderId },
    });
    if (!existing) {
      throw new NotFoundException('Folder not found');
    }
    const childFolders = await this.prisma.mediaFolder.count({
      where: { parentId: folderId },
    });
    if (childFolders > 0) {
      throw new BadRequestException(
        'Folder is not empty (contains subfolders)',
      );
    }
    const assets = await this.prisma.media.count({
      where: { folderId },
    });
    if (assets > 0) {
      throw new BadRequestException('Folder is not empty (contains media)');
    }
    await this.prisma.mediaFolder.delete({ where: { id: folderId } });
  }
}
