import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { MindmapService } from './mindmap.service';
import { UserStatsService } from './user-stats.service';

@Controller('mindmap')
export class MindmapController {
  constructor(
    private readonly mindmapService: MindmapService,
    private readonly userStatsService: UserStatsService,
  ) {}

  @Post('generate')
  async generateMindmap(
    @Body() body: { description: string; systemPrompt?: string },
    @Headers('x-user-id') userId?: string,
    @Headers('x-ai-provider') aiProvider?: string,
    @Headers('x-ai-key') aiKey?: string,
    @Headers('x-ai-url') aiUrl?: string,
    @Headers('x-ai-model') aiModel?: string,
  ) {
    const { description, systemPrompt } = body;
    
    // 生成或使用用户ID
    const finalUserId = userId || this.generateUserId();
    
    if (!description || description.trim().length === 0) {
      return {
        success: false,
        message: '描述不能为空',
      };
    }

    if (description.length > 500) {
      return {
        success: false,
        message: '描述过长，请控制在500字以内',
      };
    }

    // 检查用户使用次数限制
    const limitCheck = this.userStatsService.checkUserLimit(finalUserId);
    if (!limitCheck.allowed) {
      return {
        success: false,
        message: limitCheck.message,
        userId: finalUserId,
        remaining: 0,
      };
    }

    try {
      // 记录使用次数
      this.userStatsService.recordUsage(finalUserId);
      
      // 构建AI配置（如果提供了自定义配置）
      const customConfig = aiKey ? {
        apiKey: aiKey,
        apiUrl: aiUrl,
        model: aiModel,
        systemPrompt: systemPrompt,
      } : undefined;
      
      console.log('是否使用自定义AI配置:', !!customConfig);
      if (customConfig) {
        console.log('AI Provider:', aiProvider);
        console.log('AI Model:', aiModel);
      }
      
      const result = await this.mindmapService.generateMindmap(description, customConfig);
      
      // 获取更新后的统计信息
      const stats = this.userStatsService.getUserStats(finalUserId);
      
      return {
        success: true,
        data: result,
        userId: finalUserId,
        remaining: stats.remaining,
      };
    } catch (error) {
      console.error('生成思维导图失败:', error);
      return {
        success: false,
        message: error.message || '生成失败，请重试',
        userId: finalUserId,
      };
    }
  }

  @Get('stats')
  async getStats(@Headers('x-user-id') userId?: string) {
    const finalUserId = userId || this.generateUserId();
    const stats = this.userStatsService.getUserStats(finalUserId);
    
    return {
      success: true,
      data: {
        userId: finalUserId,
        usageCount: stats.usageCount,
        remaining: stats.remaining,
        totalUsers: stats.totalUsers,
        dailyLimit: 15,
      },
    };
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  @Post('save')
  async saveMindmap(@Body() data: any) {
    try {
      const result = await this.mindmapService.saveMindmap(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: '保存失败',
      };
    }
  }

  // 注意：动态路由必须放在最后，否则会拦截其他静态路由
  @Get(':id')
  async loadMindmap(@Param('id') id: string) {
    // 避免拦截stats路由
    if (id === 'stats') {
      return {
        success: false,
        message: '请使用 /stats 路由',
      };
    }
    
    try {
      const result = await this.mindmapService.loadMindmap(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: '加载失败',
      };
    }
  }
}
