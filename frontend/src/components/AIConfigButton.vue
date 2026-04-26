<template>
  <div class="ai-config-button" @click="$emit('click')" :title="title">
    <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path d="M512 128c-212.1 0-384 171.9-384 384s171.9 384 384 384 384-171.9 384-384-171.9-384-384-384z m0 704c-176.7 0-320-143.3-320-320s143.3-320 320-320 320 143.3 320 320-143.3 320-320 320z" fill="currentColor"/>
      <path d="M512 320c-17.7 0-32 14.3-32 32v160c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32z m0 288c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32s32-14.3 32-32v-32c0-17.7-14.3-32-32-32z" fill="currentColor"/>
      <path d="M704 480h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z m-320 0h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z" fill="currentColor"/>
    </svg>
    <span class="label">AI配置</span>
    <div v-if="hasConfig" class="status-dot"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getAIConfig } from '../utils/aiConfig'

defineEmits(['click'])

const title = 'AI模型配置'

// 检查是否已配置
const hasConfig = computed(() => {
  const config = getAIConfig()
  const providerConfig = config.providers[config.activeProvider]
  return providerConfig && providerConfig.apiKey && providerConfig.apiKey.trim() !== ''
})
</script>

<style scoped lang="less">
@import '../styles/variables.less';

.ai-config-button {
  position: fixed;
  bottom: 84px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, @primary-color 0%, #1890ff 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
  user-select: none;

  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }

  .icon {
    width: 24px;
    height: 24px;
    color: #fff;
    transition: transform 0.3s ease;
  }

  .label {
    font-size: 10px;
    color: #fff;
    margin-top: 2px;
    font-weight: 500;
    opacity: 0.9;
  }

  // 已配置状态指示点
  .status-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 10px;
    height: 10px;
    background: #52c41a;
    border-radius: 50%;
    border: 2px solid #fff;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

// 响应式：移动端调整大小和位置
@media (max-width: 768px) {
  .ai-config-button {
    width: 48px;
    height: 48px;
    bottom: 16px;
    right: 16px;

    .icon {
      width: 20px;
      height: 20px;
    }

    .label {
      font-size: 9px;
    }
  }
}
</style>
