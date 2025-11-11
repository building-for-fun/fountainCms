import { Injectable } from '@nestjs/common';

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
  private staticContent: Record<string, unknown> = {
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
      'Access API at http://localhost:3000/api/content',
    ],
    ACCENT_COLOR: '#6366f1',
    GETTING_STARTED:
      'FountainCMS lets you manage content via APIs for JAMstack and modern web apps.',
    INSTALLATION_STEPS: [
      'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
      'Install dependencies: npm install',
      'Start the server: npm run dev',
      'Access API at http://localhost:3000/api/content',
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

  private items: ContentItem[] = [];

  getAll(): Record<string, unknown> & { items: ContentItem[] } {
    return { ...this.staticContent, items: this.items };
  }

  getByKey(key: string): unknown {
    if (key === 'items') return this.items;
    return this.staticContent[key];
  }

  create(body: ContentDto): ContentItem {
    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: body.title,
      body: body.body,
      createdAt: new Date().toISOString(),
    };
    this.items.push(newContent);
    return newContent;
  }
}
