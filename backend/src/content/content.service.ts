import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ContentItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export class ContentDto {
  title!: string;
  body!: string;
}

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<{ items: ContentItem[] } & Record<string, unknown>> {
    const items = await this.prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const mapped = items.map((i) => ({
      id: i.id,
      title: i.title,
      body: i.body,
      createdAt: i.createdAt.toISOString(),
    }));
    const staticContent = {
      FEATURES_TEXT: [
        'API-first content management',
        'JAMstack ready integration',
        'Flexible content types',
        'RESTful endpoints',
        'Open-source & extensible',
      ],
      SETUP_STEPS_TEXT: [
        'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
        'Install dependencies: npm install',
        'Start the server: npm run dev',
        'Access API at http://localhost:4000/api/content',
      ],
      ACCENT_COLOR: '#6366f1',
      GETTING_STARTED:
        'FountainCMS lets you manage content via APIs for JAMstack and modern web apps.',
      INSTALLATION_STEPS: [
        'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
        'Install dependencies: npm install',
        'Start the server: npm run dev',
        'Access API at http://localhost:4000/api/content',
      ],
      API_REFERENCES: [
        {
          method: 'GET',
          endpoint: '/api/content',
          description: 'List all content items',
        },
        {
          method: 'GET',
          endpoint: '/api/content/:id',
          description: 'Get a single content item by ID',
        },
        {
          method: 'POST',
          endpoint: '/api/content',
          description: 'Create a new content item',
        },
      ],
    };
    return { ...staticContent, items: mapped };
  }

  async getByKey(key: string): Promise<unknown> {
    if (key === 'items') {
      const items = await this.prisma.content.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return items.map((i) => ({
        id: i.id,
        title: i.title,
        body: i.body,
        createdAt: i.createdAt.toISOString(),
      }));
    }
    const staticMap: Record<string, unknown> = {
      FEATURES_TEXT: [
        'API-first content management',
        'JAMstack ready integration',
        'Flexible content types',
        'RESTful endpoints',
        'Open-source & extensible',
      ],
      SETUP_STEPS_TEXT: [
        'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
        'Install dependencies: npm install',
        'Start the server: npm run dev',
        'Access API at http://localhost:4000/api/content',
      ],
      ACCENT_COLOR: '#6366f1',
      GETTING_STARTED:
        'FountainCMS lets you manage content via APIs for JAMstack and modern web apps.',
      INSTALLATION_STEPS: [
        'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
        'Install dependencies: npm install',
        'Start the server: npm run dev',
        'Access API at http://localhost:4000/api/content',
      ],
      API_REFERENCES: [
        {
          method: 'GET',
          endpoint: '/api/content',
          description: 'List all content items',
        },
        {
          method: 'GET',
          endpoint: '/api/content/:id',
          description: 'Get a single content item by ID',
        },
        {
          method: 'POST',
          endpoint: '/api/content',
          description: 'Create a new content item',
        },
      ],
    };
    return staticMap[key];
  }

  async create(body: ContentDto): Promise<ContentItem> {
    const created = await this.prisma.content.create({
      data: { title: body.title, body: body.body },
    });
    return {
      id: created.id,
      title: created.title,
      body: created.body,
      createdAt: created.createdAt.toISOString(),
    };
  }
}
