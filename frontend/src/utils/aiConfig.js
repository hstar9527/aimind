/**
 * AI配置管理模块
 * 支持多种AI模型配置，数据保存在localStorage
 */

// AI模型提供商枚举
export const AI_PROVIDERS = {
  DEEPSEEK: 'deepseek',
  KIMI: 'kimi',
  QWEN: 'qwen',
  ZHIPU: 'zhipu'
}

// 模型配置信息
export const AI_PROVIDER_INFO = {
  [AI_PROVIDERS.DEEPSEEK]: {
    name: 'DeepSeek',
    icon: '🤖',
    defaultUrl: 'https://api.deepseek.com/v1/chat/completions',
    models: ['deepseek-chat', 'deepseek-coder'],
    defaultModel: 'deepseek-chat',
    keyPlaceholder: 'sk-...',
    docUrl: 'https://platform.deepseek.com/api-docs'
  },
  [AI_PROVIDERS.KIMI]: {
    name: 'Kimi (月之暗面)',
    icon: '🌙',
    defaultUrl: 'https://api.moonshot.cn/v1/chat/completions',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    defaultModel: 'moonshot-v1-8k',
    keyPlaceholder: 'sk-...',
    docUrl: 'https://platform.moonshot.cn/docs'
  },
  [AI_PROVIDERS.QWEN]: {
    name: '通义千问',
    icon: '💬',
    defaultUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
    defaultModel: 'qwen-turbo',
    keyPlaceholder: 'sk-...',
    docUrl: 'https://help.aliyun.com/zh/dashscope/developer-reference/api-details'
  },
  [AI_PROVIDERS.ZHIPU]: {
    name: '智谱AI',
    icon: '🧠',
    defaultUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    models: ['glm-4', 'glm-4-flash', 'glm-3-turbo'],
    defaultModel: 'glm-4-flash',
    keyPlaceholder: '...',
    docUrl: 'https://open.bigmodel.cn/dev/api'
  }
}

// 默认系统提示词
export const DEFAULT_SYSTEM_PROMPT = `你是一个专业的思维导图生成助手。根据用户的描述，生成结构化的思维导图数据。

要求：
1. 生成的思维导图要层次分明、逻辑清晰
2. 主题简洁明了，每个节点不超过15个字
3. 至少包含2层结构，最多4层
4. 每个分支下至少2个子节点，最多6个
5. 返回JSON格式的数据结构

数据格式示例：
{
  "nodeData": {
    "id": "root",
    "topic": "主题名称",
    "root": true,
    "children": [
      {
        "id": "node1",
        "topic": "一级分支1",
        "direction": 0,
        "children": [
          { "id": "node1-1", "topic": "二级节点1" },
          { "id": "node1-2", "topic": "二级节点2" }
        ]
      }
    ]
  }
}`

// 本地存储键名
const STORAGE_KEY = 'ai-mind-config'

// 获取默认配置
function getDefaultConfig() {
  return {
    activeProvider: AI_PROVIDERS.DEEPSEEK,
    useBuiltIn: true,  // 新增：是否使用系统内置模型
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    providers: {
      [AI_PROVIDERS.DEEPSEEK]: {
        apiKey: '',
        apiUrl: AI_PROVIDER_INFO[AI_PROVIDERS.DEEPSEEK].defaultUrl,
        model: AI_PROVIDER_INFO[AI_PROVIDERS.DEEPSEEK].defaultModel
      },
      [AI_PROVIDERS.KIMI]: {
        apiKey: '',
        apiUrl: AI_PROVIDER_INFO[AI_PROVIDERS.KIMI].defaultUrl,
        model: AI_PROVIDER_INFO[AI_PROVIDERS.KIMI].defaultModel
      },
      [AI_PROVIDERS.QWEN]: {
        apiKey: '',
        apiUrl: AI_PROVIDER_INFO[AI_PROVIDERS.QWEN].defaultUrl,
        model: AI_PROVIDER_INFO[AI_PROVIDERS.QWEN].defaultModel
      },
      [AI_PROVIDERS.ZHIPU]: {
        apiKey: '',
        apiUrl: AI_PROVIDER_INFO[AI_PROVIDERS.ZHIPU].defaultUrl,
        model: AI_PROVIDER_INFO[AI_PROVIDERS.ZHIPU].defaultModel
      }
    }
  }
}

/**
 * 获取AI配置
 */
export function getAIConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const config = JSON.parse(stored)
      // 合并默认配置，确保新增字段也能生效
      return {
        ...getDefaultConfig(),
        ...config,
        providers: {
          ...getDefaultConfig().providers,
          ...config.providers
        }
      }
    }
  } catch (error) {
    console.error('读取AI配置失败:', error)
  }
  return getDefaultConfig()
}

/**
 * 保存AI配置
 */
export function saveAIConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    return true
  } catch (error) {
    console.error('保存AI配置失败:', error)
    return false
  }
}

/**
 * 重置为默认配置
 */
export function resetAIConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return getDefaultConfig()
  } catch (error) {
    console.error('重置AI配置失败:', error)
    return null
  }
}

/**
 * 获取当前激活的模型配置
 */
export function getActiveProviderConfig() {
  const config = getAIConfig()
  
  // 如果启用了“使用系统内置”，则返回null，让后端使用默认配置
  if (config.useBuiltIn) {
    return null
  }
  
  const provider = config.activeProvider
  const providerConfig = config.providers[provider]
  
  // 如果没有配置API Key，也返回null，使用内置配置
  if (!providerConfig.apiKey || providerConfig.apiKey.trim() === '') {
    return null
  }
  
  return {
    provider,
    ...providerConfig,
    systemPrompt: config.systemPrompt,
    providerInfo: AI_PROVIDER_INFO[provider]
  }
}

/**
 * 验证配置是否完整（仅在不使用内置时验证）
 */
export function validateConfig(config) {
  const errors = []
  
  // 如果使用内置模型，直接通过验证
  if (config.useBuiltIn) {
    return {
      valid: true,
      errors: []
    }
  }
  
  if (!config.activeProvider) {
    errors.push('请选择AI模型')
  }
  
  const providerConfig = config.providers[config.activeProvider]
  if (!providerConfig) {
    errors.push('模型配置缺失')
  } else {
    if (!providerConfig.apiKey || providerConfig.apiKey.trim() === '') {
      errors.push('请配置API Key')
    }
    if (!providerConfig.apiUrl || providerConfig.apiUrl.trim() === '') {
      errors.push('请配置API URL')
    }
    if (!providerConfig.model || providerConfig.model.trim() === '') {
      errors.push('请选择模型')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 导出配置
 */
export function exportConfig() {
  const config = getAIConfig()
  const dataStr = JSON.stringify(config, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ai-mind-config-${new Date().getTime()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 导入配置
 */
export function importConfig(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result)
        saveAIConfig(config)
        resolve(config)
      } catch (error) {
        reject(new Error('配置文件格式错误'))
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}
