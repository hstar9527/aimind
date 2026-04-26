import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

interface UserUsage {
  userId: string;
  usageCount: number;
  lastUsageDate: string;
  firstUsageDate: string;
}

interface UserStatsData {
  users: Record<string, UserUsage>;
  totalUsers: number;
  baseUserCount?: number; // 基础用户数，用于显示（默认92）
}

@Injectable()
export class UserStatsService {
  private readonly dataPath: string;
  private readonly statsFile: string;
  private readonly dailyLimit = 15; // 每天限制15次
  private readonly baseUserCount = 92; // 基础用户数

  constructor(private readonly configService: ConfigService) {
    this.dataPath = this.configService.get<string>('DATA_PATH') || './data';
    this.statsFile = path.join(this.dataPath, 'user-stats.json');
    this.ensureStatsFile();
  }

  private ensureStatsFile() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }

    if (!fs.existsSync(this.statsFile)) {
      const initialData: UserStatsData = {
        users: {},
        totalUsers: 0,
        baseUserCount: this.baseUserCount, // 设置基础用户数
      };
      fs.writeFileSync(this.statsFile, JSON.stringify(initialData, null, 2), 'utf-8');
    } else {
      // 如果文件已存在，检查是否有baseUserCount，没有则添加
      const stats = this.readStats();
      if (stats.baseUserCount === undefined) {
        stats.baseUserCount = this.baseUserCount;
        this.writeStats(stats);
      }
    }
  }

  private readStats(): UserStatsData {
    try {
      const content = fs.readFileSync(this.statsFile, 'utf-8');
      const data = JSON.parse(content);
      // 确保有baseUserCount字段
      if (data.baseUserCount === undefined) {
        data.baseUserCount = this.baseUserCount;
      }
      return data;
    } catch (error) {
      console.error('读取用户统计数据失败:', error);
      return { users: {}, totalUsers: 0, baseUserCount: this.baseUserCount };
    }
  }

  private writeStats(data: UserStatsData) {
    try {
      fs.writeFileSync(this.statsFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('写入用户统计数据失败:', error);
    }
  }

  private isSameDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1).toDateString();
    const d2 = new Date(date2).toDateString();
    return d1 === d2;
  }

  /**
   * 检查用户是否还有剩余次数
   */
  checkUserLimit(userId: string): { allowed: boolean; remaining: number; message?: string } {
    const stats = this.readStats();
    const today = new Date().toISOString();
    
    const user = stats.users[userId];

    // 新用户
    if (!user) {
      return {
        allowed: true,
        remaining: this.dailyLimit - 1, // 即将使用1次
      };
    }

    // 检查是否是同一天
    if (!this.isSameDay(user.lastUsageDate, today)) {
      // 新的一天，重置次数
      return {
        allowed: true,
        remaining: this.dailyLimit - 1,
      };
    }

    // 同一天，检查次数
    if (user.usageCount >= this.dailyLimit) {
      return {
        allowed: false,
        remaining: 0,
        message: `今日使用次数已达上限（${this.dailyLimit}次），请明天再来吧~`,
      };
    }

    return {
      allowed: true,
      remaining: this.dailyLimit - user.usageCount - 1,
    };
  }

  /**
   * 记录用户使用
   */
  recordUsage(userId: string): void {
    const stats = this.readStats();
    const today = new Date().toISOString();

    if (!stats.users[userId]) {
      // 新用户
      stats.users[userId] = {
        userId,
        usageCount: 1,
        lastUsageDate: today,
        firstUsageDate: today,
      };
      // 总用户数 = 基础用户数 + 实际用户数
      stats.totalUsers = (stats.baseUserCount || this.baseUserCount) + Object.keys(stats.users).length;
    } else {
      const user = stats.users[userId];
      
      // 检查是否是同一天
      if (!this.isSameDay(user.lastUsageDate, today)) {
        // 新的一天，重置次数
        user.usageCount = 1;
      } else {
        // 同一天，增加次数
        user.usageCount += 1;
      }
      
      user.lastUsageDate = today;
    }

    this.writeStats(stats);
  }

  /**
   * 获取用户统计信息
   */
  getUserStats(userId: string): {
    usageCount: number;
    remaining: number;
    totalUsers: number;
  } {
    const stats = this.readStats();
    const today = new Date().toISOString();
    const user = stats.users[userId];

    let usageCount = 0;
    let remaining = this.dailyLimit;

    if (user) {
      // 检查是否是同一天
      if (this.isSameDay(user.lastUsageDate, today)) {
        usageCount = user.usageCount;
        remaining = this.dailyLimit - usageCount;
      }
    }

    return {
      usageCount,
      remaining,
      totalUsers: stats.totalUsers,
    };
  }

  /**
   * 获取总用户数
   */
  getTotalUsers(): number {
    const stats = this.readStats();
    return stats.totalUsers;
  }
}
