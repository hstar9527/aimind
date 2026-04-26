import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MindmapController } from './mindmap.controller';
import { MindmapService } from './mindmap.service';
import { AiService } from './ai.service';
import { StorageService } from './storage.service';
import { UserStatsService } from './user-stats.service';

@Module({
  imports: [HttpModule],
  controllers: [MindmapController],
  providers: [MindmapService, AiService, StorageService, UserStatsService],
})
export class MindmapModule {}
