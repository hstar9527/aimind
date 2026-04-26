// IndexedDB 思维导图存储服务
const DB_NAME = 'MindMapDB'
const DB_VERSION = 1
const STORE_NAME = 'mindmaps'

class MindMapDB {
  constructor() {
    this.db = null
  }

  // 初始化数据库
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('无法打开数据库'))
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // 创建对象存储空间
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id',
            autoIncrement: true 
          })
          
          // 创建索引
          objectStore.createIndex('title', 'title', { unique: false })
          objectStore.createIndex('updateTime', 'updateTime', { unique: false })
          objectStore.createIndex('createTime', 'createTime', { unique: false })
        }
      }
    })
  }

  // 保存思维导图
  async saveMindMap(data) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      
      const mindmap = {
        ...data,
        updateTime: new Date().toISOString()
      }

      // 如果id是数字类型则更新，否则创建
      const request = (typeof data.id === 'number') ? objectStore.put(mindmap) : objectStore.add(mindmap)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (e) => {
        console.error('IndexedDB 保存错误:', e.target.error)
        reject(new Error(`保存失败: ${e.target.error?.message || '未知错误'}`))
      }
    })
  }

  // 获取所有思维导图列表
  async getAllMindMaps() {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.getAll()

      request.onsuccess = () => {
        // 按更新时间倒序排列
        const result = request.result.sort((a, b) => 
          new Date(b.updateTime) - new Date(a.updateTime)
        )
        resolve(result)
      }

      request.onerror = () => {
        reject(new Error('获取列表失败'))
      }
    })
  }

  // 获取单个思维导图
  async getMindMap(id) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.get(id)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(new Error('获取数据失败'))
      }
    })
  }

  // 删除思维导图
  async deleteMindMap(id) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.delete(id)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        reject(new Error('删除失败'))
      }
    })
  }

  // 创建新思维导图
  async createMindMap(title = '未命名思维导图') {
    const mindmap = {
      title: title,
      data: {
        nodeData: {
          id: 'root',
          topic: '开始创作',
          root: true,
          children: []
        }
      },
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }

    return await this.saveMindMap(mindmap)
  }
}

// 导出单例
export const mindmapDB = new MindMapDB()
