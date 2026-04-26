import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly defaultApiKey: string;
  private readonly defaultApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // 默认使用DeepSeek
    this.defaultApiKey = 'sk-6d968c06fad44afabca38af6d0d06c09';
    const baseUrl = 'https://api.deepseek.com/v1';
    this.defaultApiUrl = `${baseUrl}/chat/completions`;
    
    console.log('=== AI服务初始化 ===');
    console.log('API Key:', this.defaultApiKey ? `${this.defaultApiKey.substring(0, 15)}...(长度:${this.defaultApiKey.length})` : '未配置');
    console.log('API URL:', this.defaultApiUrl);
  }

  async generateMindmap(
    description: string, 
    customConfig?: {
      apiKey?: string;
      apiUrl?: string;
      model?: string;
      systemPrompt?: string;
    }
  ) {
    // 使用自定义配置或默认配置
    const apiKey = customConfig?.apiKey || this.defaultApiKey;
    const apiUrl = customConfig?.apiUrl || this.defaultApiUrl;
    const model = customConfig?.model || 'deepseek-chat';
    
    console.log('=== AI服务调用开始 ===');
    console.log('API Key 配置:', apiKey ? `${apiKey.substring(0, 15)}...(长度:${apiKey.length})` : '未配置');
    console.log('API URL:', apiUrl);
    console.log('Model:', model);
    console.log('是否使用自定义配置:', !!customConfig);
    
    if (!apiKey) {
      throw new Error('API Key未配置');
    }

    const defaultSystemPrompt = `你是一个专业的思维导图生成助手。请根据用户描述，生成一个结构化的思维导图JSON数据。

输出格式要求：
1. 必须是严格的JSON格式
2. 结构符合 Mind-Elixir 格式
3. 中心主题简洁明了
4. 主分支2-5个，每个分支有2-4个子节点
5. 内容简洁，每个节点不超过15个字

JSON格式示例：
{
  "nodeData": {
    "id": "root",
    "topic": "中心主题",
    "root": true,
    "children": [
      {
        "id": "node1",
        "topic": "主分支1",
        "direction": 1,
        "children": [
          {"id": "node1-1", "topic": "子节点1"},
          {"id": "node1-2", "topic": "子节点2"}
        ]
      }
    ]
  }
}

注意：
- direction: 1 表示右侧分支，0 表示左侧分支
- 主分支左右交替分布（direction: 0, 1, 0, 1...）
- 只输出JSON，不要有任何其他文字`;

    // 使用自定义提示词或默认提示词
    const systemPrompt = customConfig?.systemPrompt || defaultSystemPrompt;

    const userPrompt = `请为我生成一个关于"${description}"的思维导图。

要求：
1. 中心主题清晰
2. 主分支逻辑合理
3. 内容简洁实用
4. 只输出JSON数据，不要其他内容`;

    try {
      console.log('=== 发送请求 ===');
      console.log('请求 URL:', apiUrl);
      console.log('请求头 Authorization:', `Bearer ${apiKey.substring(0, 15)}...`);
      console.log('使用模型:', model);
      
      const response = await firstValueFrom(
        this.httpService.post(
          apiUrl,
          {
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
          },
        ),
      );
      
      console.log('=== 响应成功 ===');
      console.log('响应状态:', response.status);

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('AI返回内容为空');
      }

      // 解析JSON
      let jsonContent = content.trim();
      
      // 去除Markdown代码块标记
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const mindmapData = JSON.parse(jsonContent);

      // 验证数据结构
      if (!mindmapData.nodeData || !mindmapData.nodeData.topic) {
        throw new Error('数据结构不完整');
      }

      return mindmapData;
    } catch (error) {
      console.error('AI生成失败:', error);
      console.error('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : '未配置');
      console.error('API URL:', apiUrl);
      console.error('Model:', model);
      
      if (error.response) {
        console.error('响应状态:', error.response.status);
        console.error('响应数据:', JSON.stringify(error.response.data));
      }
      
      throw new Error('AI服务暂时不可用，请稍后重试');
    }
  }
}
