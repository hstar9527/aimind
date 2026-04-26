// 思维导图模版数据
export const templates = [
  {
    id: 'jitword-product',
    name: 'JitWord协同AI文档产品功能架构',
    description: 'AI协同文档产品的完整功能架构',
    data: {
      nodeData: {
        id: 'root',
        topic: 'JitWord协同AI文档',
        root: true,
        children: [
          {
            id: 'core-features',
            topic: '核心功能',
            direction: 0,
            children: [
              {
                id: 'ai-writing',
                topic: 'AI智能写作',
                children: [
                  { id: 'ai-1', topic: '智能续写' },
                  { id: 'ai-2', topic: '内容润色' },
                  { id: 'ai-3', topic: '语法纠错' },
                  { id: 'ai-4', topic: '风格转换' },
                  { id: 'ai-5', topic: '多语言翻译' }
                ]
              },
              {
                id: 'collab',
                topic: '实时协作',
                children: [
                  { id: 'collab-1', topic: '多人同时编辑' },
                  { id: 'collab-2', topic: '实时光标同步' },
                  { id: 'collab-3', topic: '评论与批注' },
                  { id: 'collab-4', topic: '变更追踪' },
                  { id: 'collab-5', topic: '权限管理' }
                ]
              },
              {
                id: 'editor',
                topic: '富文本编辑器',
                children: [
                  { id: 'editor-1', topic: '所见即所得' },
                  { id: 'editor-2', topic: 'Markdown支持' },
                  { id: 'editor-3', topic: '代码块高亮' },
                  { id: 'editor-4', topic: '表格编辑' },
                  { id: 'editor-5', topic: '数学公式' }
                ]
              },
              {
                id: 'template',
                topic: '模板中心',
                children: [
                  { id: 'template-1', topic: '行业模板' },
                  { id: 'template-2', topic: '自定义模板' },
                  { id: 'template-3', topic: '模板共享' },
                  { id: 'template-4', topic: '智能推荐' }
                ]
              }
            ]
          },
          {
            id: 'advanced-features',
            topic: '高级特性',
            direction: 1,
            children: [
              {
                id: 'knowledge',
                topic: '知识库管理',
                children: [
                  { id: 'knowledge-1', topic: '文档分类' },
                  { id: 'knowledge-2', topic: '标签体系' },
                  { id: 'knowledge-3', topic: '全文搜索' },
                  { id: 'knowledge-4', topic: '关联推荐' }
                ]
              },
              {
                id: 'version',
                topic: '版本控制',
                children: [
                  { id: 'version-1', topic: '历史版本' },
                  { id: 'version-2', topic: '版本对比' },
                  { id: 'version-3', topic: '一键恢复' },
                  { id: 'version-4', topic: '变更日志' }
                ]
              },
              {
                id: 'export',
                topic: '导出分享',
                children: [
                  { id: 'export-1', topic: 'PDF导出' },
                  { id: 'export-2', topic: 'Word导出' },
                  { id: 'export-3', topic: 'HTML导出' },
                  { id: 'export-4', topic: '链接分享' },
                  { id: 'export-5', topic: '权限控制' }
                ]
              },
              {
                id: 'integration',
                topic: '第三方集成',
                children: [
                  { id: 'integration-1', topic: '企业微信' },
                  { id: 'integration-2', topic: '钉钉' },
                  { id: 'integration-3', topic: 'Slack' },
                  { id: 'integration-4', topic: 'GitHub' }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'jitword-tech',
    name: 'JitWord AI文档技术架构',
    description: 'AI文档系统的技术架构设计',
    data: {
      nodeData: {
        id: 'root',
        topic: 'JitWord技术架构',
        root: true,
        children: [
          {
            id: 'frontend',
            topic: '前端架构',
            direction: 0,
            children: [
              {
                id: 'framework',
                topic: '技术栈',
                children: [
                  { id: 'framework-1', topic: 'Vue 3 + Composition API' },
                  { id: 'framework-2', topic: 'TypeScript' },
                  { id: 'framework-3', topic: 'Vite构建工具' },
                  { id: 'framework-4', topic: 'Pinia状态管理' }
                ]
              },
              {
                id: 'editor-core',
                topic: '编辑器核心',
                children: [
                  { id: 'editor-1', topic: 'ProseMirror' },
                  { id: 'editor-2', topic: 'Tiptap扩展' },
                  { id: 'editor-3', topic: '自定义节点' },
                  { id: 'editor-4', topic: '插件系统' }
                ]
              },
              {
                id: 'realtime',
                topic: '实时协作',
                children: [
                  { id: 'realtime-1', topic: 'WebSocket连接' },
                  { id: 'realtime-2', topic: 'CRDT算法' },
                  { id: 'realtime-3', topic: 'Yjs框架' },
                  { id: 'realtime-4', topic: '冲突解决' }
                ]
              },
              {
                id: 'ui',
                topic: 'UI组件',
                children: [
                  { id: 'ui-1', topic: 'Element Plus' },
                  { id: 'ui-2', topic: '自定义组件库' },
                  { id: 'ui-3', topic: '响应式设计' },
                  { id: 'ui-4', topic: '主题系统' }
                ]
              }
            ]
          },
          {
            id: 'backend',
            topic: '后端架构',
            direction: 1,
            children: [
              {
                id: 'server',
                topic: '服务层',
                children: [
                  { id: 'server-1', topic: 'NestJS框架' },
                  { id: 'server-2', topic: 'TypeScript' },
                  { id: 'server-3', topic: 'RESTful API' },
                  { id: 'server-4', topic: 'GraphQL' }
                ]
              },
              {
                id: 'database',
                topic: '数据存储',
                children: [
                  { id: 'db-1', topic: 'PostgreSQL' },
                  { id: 'db-2', topic: 'Redis缓存' },
                  { id: 'db-3', topic: 'MongoDB文档存储' },
                  { id: 'db-4', topic: 'MinIO对象存储' }
                ]
              },
              {
                id: 'ai-service',
                topic: 'AI服务',
                children: [
                  { id: 'ai-1', topic: 'DeepSeek模型' },
                  { id: 'ai-2', topic: 'GPT-4集成' },
                  { id: 'ai-3', topic: '向量数据库' },
                  { id: 'ai-4', topic: 'Prompt工程' },
                  { id: 'ai-5', topic: '流式响应' }
                ]
              },
              {
                id: 'microservice',
                topic: '微服务',
                children: [
                  { id: 'micro-1', topic: '用户服务' },
                  { id: 'micro-2', topic: '文档服务' },
                  { id: 'micro-3', topic: '协作服务' },
                  { id: 'micro-4', topic: '搜索服务' }
                ]
              }
            ]
          },
          {
            id: 'infrastructure',
            topic: '基础设施',
            direction: 0,
            children: [
              {
                id: 'deploy',
                topic: '部署方案',
                children: [
                  { id: 'deploy-1', topic: 'Docker容器化' },
                  { id: 'deploy-2', topic: 'Kubernetes编排' },
                  { id: 'deploy-3', topic: 'CI/CD流程' },
                  { id: 'deploy-4', topic: '灰度发布' }
                ]
              },
              {
                id: 'monitor',
                topic: '监控运维',
                children: [
                  { id: 'monitor-1', topic: 'Prometheus监控' },
                  { id: 'monitor-2', topic: 'Grafana可视化' },
                  { id: 'monitor-3', topic: '日志收集' },
                  { id: 'monitor-4', topic: '告警系统' }
                ]
              },
              {
                id: 'security',
                topic: '安全保障',
                children: [
                  { id: 'security-1', topic: 'JWT认证' },
                  { id: 'security-2', topic: 'HTTPS加密' },
                  { id: 'security-3', topic: '数据加密' },
                  { id: 'security-4', topic: '权限控制' }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'pxcharts-product',
    name: 'PxCharts多维表格产品功能介绍',
    description: 'PxCharts超级表格的核心功能体系',
    data: {
      nodeData: {
        id: 'root',
        topic: 'PxCharts多维表格',
        root: true,
        children: [
          {
            id: 'table-features',
            topic: '表格核心功能',
            direction: 0,
            children: [
              {
                id: 'multi-view',
                topic: '多视图展示',
                children: [
                  { id: 'view-1', topic: '表格视图' },
                  { id: 'view-2', topic: '看板视图' },
                  { id: 'view-3', topic: '画廊视图' },
                  { id: 'view-4', topic: '日历视图' },
                  { id: 'view-5', topic: '甘特图视图' },
                  { id: 'view-6', topic: '表单视图' }
                ]
              },
              {
                id: 'field-types',
                topic: '丰富字段类型',
                children: [
                  { id: 'field-1', topic: '文本/数字' },
                  { id: 'field-2', topic: '单选/多选' },
                  { id: 'field-3', topic: '日期时间' },
                  { id: 'field-4', topic: '附件上传' },
                  { id: 'field-5', topic: '关联记录' },
                  { id: 'field-6', topic: '公式计算' },
                  { id: 'field-7', topic: '评分/进度条' }
                ]
              },
              {
                id: 'filter-sort',
                topic: '筛选与排序',
                children: [
                  { id: 'filter-1', topic: '高级筛选' },
                  { id: 'filter-2', topic: '多维度排序' },
                  { id: 'filter-3', topic: '分组聚合' },
                  { id: 'filter-4', topic: '条件格式化' }
                ]
              },
              {
                id: 'automation',
                topic: '自动化功能',
                children: [
                  { id: 'auto-1', topic: '触发器设置' },
                  { id: 'auto-2', topic: '自动化动作' },
                  { id: 'auto-3', topic: '定时任务' },
                  { id: 'auto-4', topic: '工作流编排' }
                ]
              }
            ]
          },
          {
            id: 'data-features',
            topic: '数据管理',
            direction: 1,
            children: [
              {
                id: 'import-export',
                topic: '数据导入导出',
                children: [
                  { id: 'io-1', topic: 'Excel导入导出' },
                  { id: 'io-2', topic: 'CSV格式支持' },
                  { id: 'io-3', topic: 'API接口' },
                  { id: 'io-4', topic: '批量操作' }
                ]
              },
              {
                id: 'relation',
                topic: '数据关联',
                children: [
                  { id: 'relation-1', topic: '表间关联' },
                  { id: 'relation-2', topic: '双向链接' },
                  { id: 'relation-3', topic: '引用字段' },
                  { id: 'relation-4', topic: '汇总计算' }
                ]
              },
              {
                id: 'permission',
                topic: '权限管理',
                children: [
                  { id: 'perm-1', topic: '成员权限' },
                  { id: 'perm-2', topic: '字段权限' },
                  { id: 'perm-3', topic: '视图权限' },
                  { id: 'perm-4', topic: '分享链接' }
                ]
              },
              {
                id: 'template-market',
                topic: '模板市场',
                children: [
                  { id: 'temp-1', topic: '项目管理' },
                  { id: 'temp-2', topic: 'CRM客户管理' },
                  { id: 'temp-3', topic: 'OKR目标管理' },
                  { id: 'temp-4', topic: '内容日历' },
                  { id: 'temp-5', topic: '库存管理' }
                ]
              }
            ]
          },
          {
            id: 'collaboration',
            topic: '协作功能',
            direction: 0,
            children: [
              {
                id: 'team-work',
                topic: '团队协作',
                children: [
                  { id: 'team-1', topic: '多人实时编辑' },
                  { id: 'team-2', topic: '@提及成员' },
                  { id: 'team-3', topic: '评论讨论' },
                  { id: 'team-4', topic: '任务分配' }
                ]
              },
              {
                id: 'notification',
                topic: '通知提醒',
                children: [
                  { id: 'notify-1', topic: '邮件通知' },
                  { id: 'notify-2', topic: '应用内提醒' },
                  { id: 'notify-3', topic: '企业微信集成' },
                  { id: 'notify-4', topic: '钉钉集成' }
                ]
              },
              {
                id: 'version-control',
                topic: '版本管理',
                children: [
                  { id: 'vc-1', topic: '操作历史' },
                  { id: 'vc-2', topic: '数据回滚' },
                  { id: 'vc-3', topic: '变更记录' },
                  { id: 'vc-4', topic: '审计日志' }
                ]
              }
            ]
          },
          {
            id: 'analysis',
            topic: '数据分析',
            direction: 1,
            children: [
              {
                id: 'chart',
                topic: '图表可视化',
                children: [
                  { id: 'chart-1', topic: '柱状图/折线图' },
                  { id: 'chart-2', topic: '饼图/环形图' },
                  { id: 'chart-3', topic: '散点图' },
                  { id: 'chart-4', topic: '仪表盘' }
                ]
              },
              {
                id: 'statistics',
                topic: '统计分析',
                children: [
                  { id: 'stat-1', topic: '数据透视表' },
                  { id: 'stat-2', topic: '汇总统计' },
                  { id: 'stat-3', topic: '趋势分析' },
                  { id: 'stat-4', topic: '自定义指标' }
                ]
              },
              {
                id: 'report',
                topic: '报表功能',
                children: [
                  { id: 'report-1', topic: '报表模板' },
                  { id: 'report-2', topic: '定时生成' },
                  { id: 'report-3', topic: '导出分享' },
                  { id: 'report-4', topic: '订阅推送' }
                ]
              }
            ]
          }
        ]
      }
    }
  }
]

// 获取所有模版
export const getAllTemplates = () => {
  return templates
}

// 根据ID获取模版
export const getTemplateById = (id) => {
  return templates.find(t => t.id === id)
}
