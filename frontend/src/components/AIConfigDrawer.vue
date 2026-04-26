<template>
  <transition name="drawer">
    <div v-if="visible" class="ai-config-drawer-mask" @click.self="handleClose">
      <div class="ai-config-drawer" @click.stop>
        <!-- 头部 -->
        <div class="drawer-header">
          <h2>AI模型配置</h2>
          <button class="close-btn" @click="handleClose" title="关闭">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <!-- 内容区 -->
        <div class="drawer-content">
          <!-- 使用系统内置模型开关 -->
          <section class="config-section">
            <div class="use-builtin-switch">
              <label class="switch-label">
                <input 
                  type="checkbox" 
                  v-model="config.useBuiltIn" 
                  class="switch-checkbox"
                />
                <span class="switch-slider"></span>
                <span class="switch-text">
                  <strong>使用系统内置 DeepSeek 模型</strong>
                  <span class="switch-desc">（免配置，开启后将使用我们提供的 API 服务）</span>
                </span>
              </label>
              <div v-if="config.useBuiltIn" class="builtin-tip">
                ✅ 已启用系统内置模型，无需配置 API Key
              </div>
            </div>
          </section>

          <!-- 模型选择 -->
          <section class="config-section" v-if="!config.useBuiltIn">
            <h3>选择AI模型</h3>
            <div class="provider-grid">
              <div
                v-for="(info, key) in AI_PROVIDER_INFO"
                :key="key"
                class="provider-card"
                :class="{ active: config.activeProvider === key }"
                @click="selectProvider(key)"
              >
                <div class="provider-icon">{{ info.icon }}</div>
                <div class="provider-name">{{ info.name }}</div>
                <div v-if="config.providers[key].apiKey" class="provider-status">✓ 已配置</div>
              </div>
            </div>
          </section>

          <!-- 当前模型配置 -->
          <section class="config-section" v-if="!config.useBuiltIn">
            <h3>{{ currentProviderInfo.name }} 配置</h3>
            
            <!-- API Key -->
            <div class="form-item">
              <label>
                API Key
                <a :href="currentProviderInfo.docUrl" target="_blank" class="doc-link">获取密钥</a>
              </label>
              <div class="input-with-toggle">
                <input
                  :type="showApiKey ? 'text' : 'password'"
                  v-model="currentProviderConfig.apiKey"
                  :placeholder="currentProviderInfo.keyPlaceholder"
                  class="input"
                />
                <button class="toggle-btn" @click="showApiKey = !showApiKey" type="button">
                  {{ showApiKey ? '隐藏' : '显示' }}
                </button>
              </div>
            </div>

            <!-- 模型选择 -->
            <div class="form-item">
              <label>模型</label>
              <select v-model="currentProviderConfig.model" class="input">
                <option v-for="model in currentProviderInfo.models" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>

            <!-- API URL (高级配置) -->
            <div class="form-item">
              <label>
                API URL
                <span class="label-tip">(高级配置，一般无需修改)</span>
              </label>
              <input
                type="text"
                v-model="currentProviderConfig.apiUrl"
                :placeholder="currentProviderInfo.defaultUrl"
                class="input"
              />
            </div>
          </section>

          <!-- 系统提示词 -->
          <section class="config-section">
            <h3>
              系统提示词
              <button class="reset-prompt-btn" @click="resetPrompt" type="button">恢复默认</button>
            </h3>
            <div class="form-item">
              <textarea
                v-model="config.systemPrompt"
                class="textarea"
                rows="8"
                placeholder="输入自定义的系统提示词..."
              ></textarea>
              <div class="tip">
                💡 提示词决定了AI生成思维导图的风格和质量，可以根据需要自定义
              </div>
            </div>
          </section>

          <!-- 配置管理 -->
          <section class="config-section">
            <h3>配置管理</h3>
            <div class="action-buttons">
              <button class="action-btn" @click="handleExport">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8z" fill="currentColor"/>
                  <path d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z" fill="currentColor"/>
                </svg>
                导出配置
              </button>
              <button class="action-btn" @click="handleImport">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path d="M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z" fill="currentColor"/>
                  <path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10c54.3 14.5 92.1 63.8 92.1 120 0 33.1-13.1 64.6-36.9 88.6C829.6 870.4 798 884 764.3 884H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h44.3C870 960 960 869.5 960 759.5c0-92.7-63.1-170.7-148.6-193.8z" fill="currentColor"/>
                </svg>
                导入配置
              </button>
              <button class="action-btn danger" @click="handleReset">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 0 0-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 0 1 655.9 840c-42.7 17.9-88.1 27-134.9 27-46.5 0-91.5-9.1-134.2-27A341.5 341.5 0 0 1 279 755.2a342.16 342.16 0 0 1-109.3-109.4c-17.9-42.8-27-88.1-27-134.9 0-46.5 9.1-91.5 27-134.2a341.5 341.5 0 0 1 84.8-107.8 342.16 342.16 0 0 1 109.3-109.4C406.7 141.1 452 132 498.5 132c56.5 0 111.1 11.6 162.1 34.3 45.9 20.4 86.8 49.7 121.4 87l-86.4 67.4c-3.6 2.8-4.6 7.8-2.5 11.9l85.3 164.2c2.3 4.4 7.6 6.1 11.9 3.8l164.4-85c4.4-2.3 6.2-7.7 3.8-12.1z" fill="currentColor"/>
                </svg>
                重置配置
              </button>
            </div>
          </section>
        </div>

        <!-- 底部操作栏 -->
        <div class="drawer-footer">
          <button class="btn btn-default" @click="handleClose">取消</button>
          <button class="btn btn-primary" @click="handleSave">保存配置</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  AI_PROVIDERS, 
  AI_PROVIDER_INFO, 
  DEFAULT_SYSTEM_PROMPT,
  getAIConfig, 
  saveAIConfig, 
  resetAIConfig,
  exportConfig,
  importConfig,
  validateConfig
} from '../utils/aiConfig'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'saved'])

// 本地配置副本
const config = ref(getAIConfig())
const showApiKey = ref(false)

// 当前选中的提供商配置
const currentProviderConfig = computed(() => {
  return config.value.providers[config.value.activeProvider]
})

const currentProviderInfo = computed(() => {
  return AI_PROVIDER_INFO[config.value.activeProvider]
})

// 监听visible变化，重新加载配置
watch(() => props.visible, (newVal) => {
  if (newVal) {
    config.value = getAIConfig()
    showApiKey.value = false
  }
})

// 选择提供商
function selectProvider(provider) {
  config.value.activeProvider = provider
}

// 恢复默认提示词
function resetPrompt() {
  if (confirm('确定要恢复默认系统提示词吗？')) {
    config.value.systemPrompt = DEFAULT_SYSTEM_PROMPT
  }
}

// 导出配置
function handleExport() {
  try {
    exportConfig()
  } catch (error) {
    alert('导出配置失败：' + error.message)
  }
}

// 导入配置
function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const imported = await importConfig(file)
        config.value = imported
        alert('导入配置成功！')
      } catch (error) {
        alert('导入配置失败：' + error.message)
      }
    }
  }
  input.click()
}

// 重置配置
function handleReset() {
  if (confirm('确定要重置所有配置吗？这将清除所有自定义设置。')) {
    const defaultConfig = resetAIConfig()
    if (defaultConfig) {
      config.value = defaultConfig
      alert('配置已重置')
    }
  }
}

// 关闭抽屉
function handleClose() {
  emit('update:visible', false)
}

// 保存配置
function handleSave() {
  // 验证配置
  const validation = validateConfig(config.value)
  if (!validation.valid) {
    alert('配置有误：\n' + validation.errors.join('\n'))
    return
  }

  // 保存到localStorage
  const success = saveAIConfig(config.value)
  if (success) {
    alert('保存成功！')
    emit('saved', config.value)
    handleClose()
  } else {
    alert('保存失败，请重试')
  }
}
</script>

<style scoped lang="less">
@import '../styles/variables.less';

// 遮罩层动画
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;

  .ai-config-drawer {
    transition: transform 0.3s ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .ai-config-drawer {
    transform: translateX(100%);
  }
}

.ai-config-drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(4px);
}

.ai-config-drawer {
  width: 520px;
  max-width: 90vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
}

// 头部
.drawer-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: @text-primary;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @text-secondary;
    transition: all 0.2s;

    &:hover {
      background: #f5f5f5;
      color: @text-primary;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

// 内容区
.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 4px;

    &:hover {
      background: #bfbfbf;
    }
  }
}

.config-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: @text-primary;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

// 使用系统内置开关
.use-builtin-switch {
  .switch-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    position: relative;
  }

  .switch-checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;

    &:checked + .switch-slider {
      background: @primary-color;

      &:before {
        transform: translateX(24px);
      }
    }
  }

  .switch-slider {
    position: relative;
    width: 48px;
    height: 24px;
    background: #d9d9d9;
    border-radius: 12px;
    transition: all 0.3s;
    flex-shrink: 0;

    &:before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: all 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  .switch-text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-size: 14px;
      color: @text-primary;
    }

    .switch-desc {
      font-size: 12px;
      color: @text-secondary;
      line-height: 1.4;
    }
  }

  .builtin-tip {
    margin-top: 12px;
    padding: 12px;
    background: rgba(82, 196, 26, 0.08);
    border-left: 3px solid #52c41a;
    border-radius: 4px;
    font-size: 13px;
    color: #52c41a;
    font-weight: 500;
  }
}

// 模型卡片网格
.provider-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.provider-card {
  padding: 16px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;

  &:hover {
    border-color: @primary-color;
    background: rgba(0, 102, 255, 0.02);
  }

  &.active {
    border-color: @primary-color;
    background: rgba(0, 102, 255, 0.05);
    box-shadow: 0 2px 8px rgba(0, 102, 255, 0.15);
  }

  .provider-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .provider-name {
    font-size: 14px;
    font-weight: 500;
    color: @text-primary;
  }

  .provider-status {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 12px;
    color: #52c41a;
    font-weight: 500;
  }
}

// 表单项
.form-item {
  margin-bottom: 16px;

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: @text-primary;

    .label-tip {
      font-size: 12px;
      color: @text-secondary;
      font-weight: 400;
    }
  }

  .doc-link {
    font-size: 12px;
    color: @primary-color;
    text-decoration: none;
    font-weight: 400;

    &:hover {
      text-decoration: underline;
    }
  }
}

.input,
.textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: @primary-color;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
  }

  &::placeholder {
    color: #bfbfbf;
  }
}

.textarea {
  resize: vertical;
  line-height: 1.6;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.input-with-toggle {
  display: flex;
  gap: 8px;

  .input {
    flex: 1;
  }

  .toggle-btn {
    padding: 0 16px;
    border: 1px solid #d9d9d9;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    color: @text-secondary;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;

    &:hover {
      border-color: @primary-color;
      color: @primary-color;
    }
  }
}

.tip {
  margin-top: 8px;
  font-size: 12px;
  color: @text-secondary;
  line-height: 1.6;
}

.reset-prompt-btn {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  font-size: 12px;
  color: @text-secondary;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: @primary-color;
    color: @primary-color;
  }
}

// 操作按钮组
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 140px;
  padding: 10px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  color: @text-primary;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: @primary-color;
    color: @primary-color;
  }

  &.danger {
    &:hover {
      border-color: #ff4d4f;
      color: #ff4d4f;
      background: #fff1f0;
    }
  }
}

// 底部操作栏
.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;

  &.btn-default {
    background: #fff;
    border: 1px solid #d9d9d9;
    color: @text-primary;

    &:hover {
      border-color: @primary-color;
      color: @primary-color;
    }
  }

  &.btn-primary {
    background: @primary-color;
    color: #fff;

    &:hover {
      background: #1890ff;
    }

    &:active {
      background: #0066cc;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .ai-config-drawer {
    width: 100vw;
    max-width: 100vw;
  }

  .provider-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;

    .action-btn {
      min-width: auto;
    }
  }
}
</style>
