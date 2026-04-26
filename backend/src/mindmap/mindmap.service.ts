import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { StorageService } from './storage.service';

@Injectable()
export class MindmapService {
  constructor(
    private readonly aiService: AiService,
    private readonly storageService: StorageService,
  ) {}

  async generateMindmap(
    description: string, 
    customConfig?: {
      apiKey?: string;
      apiUrl?: string;
      model?: string;
      systemPrompt?: string;
    }
  ) {
    // 调用AI服务生成思维导图
    const mindmapData = await this.aiService.generateMindmap(description, customConfig);
    return mindmapData;
  }

  async saveMindmap(data: any) {
    // 保存思维导图到JSON文件
    const result = await this.storageService.save(data);
    return result;
  }

  async loadMindmap(id: string) {
    // 从JSON文件加载思维导图
    const data = await this.storageService.load(id);
    return data;
  }
}
