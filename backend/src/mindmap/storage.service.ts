import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly dataPath: string;

  constructor(private readonly configService: ConfigService) {
    this.dataPath = this.configService.get<string>('DATA_PATH') || './data';
    this.ensureDataDir();
  }

  private ensureDataDir() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  async save(data: any): Promise<{ id: string }> {
    const id = data.id || this.generateId();
    const filePath = path.join(this.dataPath, `${id}.json`);
    
    const saveData = {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(saveData, null, 2), 'utf-8');
    
    return { id };
  }

  async load(id: string): Promise<any> {
    const filePath = path.join(this.dataPath, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error('文件不存在');
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  private generateId(): string {
    return `mindmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
