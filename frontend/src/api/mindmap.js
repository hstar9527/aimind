import apiClient from '../utils/api'

// 获取或生成用户ID
function getUserId() {
  let userId = localStorage.getItem('ai-mind-user-id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('ai-mind-user-id', userId)
  }
  return userId
}

export const mindmapApi = {
  // AI生成思维导图
  generateMindmap: (description, aiConfig = null) => {
    const headers = { 'x-user-id': getUserId() }
    
    // 如果提供了自定义AI配置，将其添加到headers
    if (aiConfig) {
      headers['x-ai-provider'] = aiConfig.provider
      headers['x-ai-key'] = aiConfig.apiKey
      headers['x-ai-url'] = aiConfig.apiUrl
      headers['x-ai-model'] = aiConfig.model
    }
    
    return apiClient.post('/mindmap/generate', 
      { 
        description,
        systemPrompt: aiConfig?.systemPrompt 
      },
      { headers }
    )
  },

  // 获取用户统计信息
  getStats: () => {
    return apiClient.get('/mindmap/stats', 
      { headers: { 'x-user-id': getUserId() } }
    )
  },

  // 保存思维导图
  saveMindmap: (data) => {
    return apiClient.post('/mindmap/save', data)
  },

  // 加载思维导图
  loadMindmap: (id) => {
    return apiClient.get(`/mindmap/${id}`)
  }
}
