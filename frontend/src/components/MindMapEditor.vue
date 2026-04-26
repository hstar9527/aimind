<template>
  <div class="mindmap-editor">
    <!-- 悬浮顶部操作栏 -->
    <div class="floating-toolbar">
      <div class="toolbar-left">
        <img src="/logo.png" alt="AI Mind Logo" class="logo" />
        <span class="title">Mind</span>
        <span class="user-stats">{{ totalUsersText }}</span>
      </div>
      <div class="toolbar-right">
        <!-- 统一操作按钮组 -->
        <div class="unified-action-group">
          <!-- 撤销按钮 -->
          <button class="group-btn" @click="handleUndo" title="撤销 (Ctrl+Z)">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M533.333333 298.666667V170.666667L298.666667 341.333333l234.666666 170.666667v-128c117.333333 0 213.333333 96 213.333334 213.333333s-96 213.333333-213.333334 213.333334-213.333333-96-213.333333-213.333334H234.666667c0 164.266667 133.333333 298.666667 298.666666 298.666667s298.666667-134.4 298.666667-298.666667-134.4-298.666667-298.666667-298.666666z" fill="currentColor"/>
            </svg>
          </button>

          <div class="divider"></div>

          <!-- 重做按钮 -->
          <button class="group-btn" @click="handleRedo" title="重做 (Ctrl+Y)">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M490.666667 298.666667V170.666667L725.333333 341.333333l-234.666666 170.666667v-128c-117.333333 0-213.333333 96-213.333334 213.333333s96 213.333333 213.333334 213.333334 213.333333-96 213.333333-213.333334h85.333333c0 164.266667-133.333333 298.666667-298.666666 298.666667s-298.666667-134.4-298.666667-298.666667 134.4-298.666667 298.666667-298.666666z" fill="currentColor"/>
            </svg>
          </button>

          <div class="divider"></div>

          <!-- AI生成按钮 -->
          <button class="group-btn ai-btn" @click="toggleAIInput" title="AI智能生成思维导图">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M512 64l128 256 256 128-256 128-128 256-128-256-256-128 256-128z" fill="currentColor"/>
            </svg>
            <span class="btn-text">AI生成</span>
            <span v-if="remaining !== null" class="badge">{{ remaining }}/15</span>
          </button>

          <div class="divider"></div>

          <!-- 导入MD按钮 -->
          <button class="group-btn" @click="handleImportMD" title="导入Markdown文件">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M854.6 288.7L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.6zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494zM429 481.2c-1.9-4.4-6.2-7.2-11-7.2h-35c-6.6 0-12 5.4-12 12v272c0 6.6 5.4 12 12 12h27.1c6.6 0 12-5.4 12-12V582.1l66.8 150.2c1.9 4.3 6.2 7.1 10.9 7.1h24.4c4.7 0 9-2.8 10.9-7.1l66.8-150.6V758c0 6.6 5.4 12 12 12H643c6.6 0 12-5.4 12-12V486c0-6.6-5.4-12-12-12h-34.7c-4.8 0-9.1 2.8-11 7.2l-83.1 191.5-83.2-191.5z" fill="currentColor"/>
            </svg>
          </button>
          <input 
            ref="mdFileInput" 
            type="file" 
            accept=".md,.markdown" 
            style="display: none" 
            @change="handleFileSelect"
          />

          <div class="divider"></div>

          <!-- 导出MD按钮 -->
          <button class="group-btn" @click="handleExportMD" title="导出Markdown文件">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M854.6 288.7L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.6zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494zM512 566.1l92.9 91.4c4.7 4.6 12.3 4.6 17 0l17-16.7c4.7-4.6 4.7-12.1 0-16.8L546.3 532H748c6.6 0 12-5.4 12-12v-24c0-6.6-5.4-12-12-12H546.3l92.6-91.9c4.7-4.6 4.7-12.1 0-16.8l-17-16.7c-4.7-4.6-12.3-4.6-17 0L512 449.9l-92.9-91.4c-4.7-4.6-12.3-4.6-17 0l-17 16.7c-4.7 4.6-4.7 12.1 0 16.8l92.6 91.9H276c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h201.7l-92.6 91.9c-4.7 4.6-4.7 12.1 0 16.8l17 16.7c4.7 4.6 12.3 4.6 17 0L512 566.1z" fill="currentColor"/>
            </svg>
          </button>

          <div class="divider"></div>

          <!-- 清空画布按钮 -->
          <button class="group-btn" @click="handleClearCanvas" title="清空画布">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6c-0.3 1.5-0.4 3-0.4 4.4 0 14.4 11.6 26 26 26h723c1.5 0 3-0.1 4.4-0.4 14.2-2.4 23.7-15.9 21.2-30zM204 390h272V182h72v208h272v104H204V390z m468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z" fill="currentColor"/>
            </svg>
          </button>

          <div class="divider"></div>

          <!-- 模版库按钮 -->
          <button class="group-btn template-btn" @click="toggleTemplateMenu" title="模版库">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zM360 792H232V440h128v352z m240 0H424V440h176v352z m264 0H688V440h176v352z m0-456H232V280h632v56z" fill="currentColor"/>
            </svg>
            <span class="btn-text">模版</span>
            <span class="hot-badge">热</span>
          </button>

          <!-- 模版下拉菜单 -->
          <div v-if="showTemplateMenu" class="template-menu" @click.stop>
            <div class="menu-header">
              <span class="menu-title">模版库</span>
              <button class="close-menu-btn" @click="showTemplateMenu = false">×</button>
            </div>
            <div class="template-list">
              <div 
                v-for="template in templates" 
                :key="template.id"
                class="template-item"
                @click="applyTemplate(template)"
              >
                <div class="template-icon">
                  <svg v-if="template.id === 'jitword-product'" viewBox="0 0 1024 1024" width="32" height="32">
                    <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z" fill="#0066FF"/>
                    <path d="M429 481.2c-1.9-4.4-6.2-7.2-11-7.2h-35c-6.6 0-12 5.4-12 12v272c0 6.6 5.4 12 12 12h27.1c6.6 0 12-5.4 12-12V582.1l66.8 150.2c1.9 4.3 6.2 7.1 10.9 7.1h24.4c4.7 0 9-2.8 10.9-7.1l66.8-150.6V758c0 6.6 5.4 12 12 12H643c6.6 0 12-5.4 12-12V486c0-6.6-5.4-12-12-12h-34.7c-4.8 0-9.1 2.8-11 7.2l-83.1 191.5-83.2-191.5z" fill="#0066FF"/>
                  </svg>
                  <svg v-else-if="template.id === 'jitword-tech'" viewBox="0 0 1024 1024" width="32" height="32">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292c-12.7 17.7-39 17.7-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="#FF6D00"/>
                  </svg>
                  <svg v-else-if="template.id === 'pxcharts-product'" viewBox="0 0 1024 1024" width="32" height="32">
                    <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zM338 792H232V440h106v352zm234 0H426V440h146v352zm252 0H678V440h146v352z" fill="#00C853"/>
                    <path d="M232 328h560v72H232z" fill="#00C853"/>
                  </svg>
                </div>
                <div class="template-info">
                  <div class="template-name">{{ template.name }}</div>
                  <div class="template-desc">{{ template.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 页面管理按钮 -->
          <button class="group-btn" @click="togglePageManager" title="页面管理">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192 0c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192 0c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464z" fill="currentColor"/>
            </svg>
          </button>

          <div class="divider"></div>

          <!-- 主题选择器 -->
          <div class="theme-selector-inline" @click="toggleThemeMenu" title="切换主题配色">
            <div class="color-dot" :style="{background: currentColor}"></div>
            <span class="theme-text">{{ currentTheme }}</span>
            <svg class="icon arrow-icon" viewBox="0 0 1024 1024" width="12" height="12">
              <path d="M512 714.666667L106.666667 309.333333l60.586666-60.586666L512 593.493333l344.746667-344.746666 60.586666 60.586666z" fill="currentColor"/>
            </svg>

            <!-- 主题下拉菜单 -->
            <div v-if="showThemeMenu" class="theme-menu" @click.stop>
              <div 
                v-for="theme in themes" 
                :key="theme.name"
                class="theme-item"
                :class="{ active: theme.name === currentTheme }"
                @click="changeTheme(theme)"
              >
                <div class="theme-dot" :style="{background: theme.color}"></div>
                <span>{{ theme.name }}</span>
                <svg v-if="theme.name === currentTheme" class="check-icon" viewBox="0 0 1024 1024" width="14" height="14">
                  <path d="M406.656 706.944L195.84 496.128l45.248-45.248 165.568 165.568 359.168-359.168 45.248 45.248z" fill="#1890ff"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- AI输入框 -->
        <div v-if="showAIInput" class="ai-input-wrapper">
          <div class="ai-input-container">
            <div class="input-wrapper">
              <input
                v-model="aiDescription"
                class="ai-input"
                type="text"
                placeholder="描述你想要生成的思维导图..."
                @keydown.enter="handleGenerate"
              />
            </div>
            <div class="button-group">
              <button 
                class="send-btn" 
                @click="handleGenerate"
                :disabled="!aiDescription.trim() || isGenerating"
                :title="isGenerating ? '生成中...' : '发送'"
              >
                <span class="send-icon">➤</span>
              </button>
              <button class="close-btn" @click="toggleAIInput" title="关闭">
                <span class="close-icon">×</span>
              </button>
            </div>
          </div>
          <div class="example-prompts">
            <span class="example-item" @click="useExample('项目管理流程')">>项目管理流程</span>
            <span class="example-item" @click="useExample('产品设计流程')">>产品设计流程</span>
            <span class="example-item" @click="useExample('前端技术栈')">>前端技术栈</span>
          </div>
        </div>
        
        <!-- 外部链接按钮 -->
        <div class="link-buttons-wrapper">
          <transition name="slide-fade">
            <div v-show="showLinkButtons" class="link-buttons">
              <a href="https://jitword.com" target="_blank" class="link-btn" title="AI协同文档">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z" fill="currentColor"/>
                </svg>
                <span>AI协同文档</span>
              </a>

              <a href="https://pxcharts.turntip.cn" target="_blank" class="link-btn" title="PxCharts超级表格">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zM338 792H232V232h106v560zm234 0H426V232h146v560zm252 0H678V232h146v560z" fill="currentColor"/>
                </svg>
                <span>PxCharts超级表格</span>
              </a>
            </div>
          </transition>

          <!-- 展开/收起按钮 -->
          <button class="toggle-btn" @click="toggleLinkButtons" :title="showLinkButtons ? '收起' : '展开'">
            <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
              <path v-if="showLinkButtons" d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="currentColor"/>
              <path v-else d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 思维导图画布（全屏） -->
    <div id="mindmap-container" ref="mindmapContainer"></div>

    <!-- 左下角版权信息 -->
    <div class="copyright-info">
      本项目由【趣谈AI】公众号独家打造
    </div>

    <!-- AI配置悬浮按钮 -->
    <AIConfigButton @click="showConfigDrawer = true" />

    <!-- AI配置抽屉 -->
    <AIConfigDrawer 
      v-model:visible="showConfigDrawer" 
      @saved="handleConfigSaved"
    />

    <!-- AI输入对话框 -->
    <div v-if="isAIDialogVisible" class="ai-dialog-overlay" @click="closeAIDialog">
      <div class="ai-dialog" @click.stop>
        <div class="ai-dialog-header">
          <h3>AI生成思维导图</h3>
          <button class="close-btn" @click="closeAIDialog">✕</button>
        </div>
        <div class="ai-dialog-body">
          <textarea
            v-model="aiDescription"
            class="ai-input"
            placeholder="描述你想要生成的思维导图内容，例如：&#10;• PxCharts产品架构&#10;• 项目管理流程&#10;• 敏捷开发流程"
            rows="6"
            autofocus
          ></textarea>
          <div class="ai-tips">
            <span class="tip-icon">💡</span>
            描述越详细，生成的思维导图越准确
          </div>
        </div>
        <div class="ai-dialog-footer">
          <button class="btn btn-default" @click="closeAIDialog">取消</button>
          <button 
            class="btn btn-primary" 
            @click="handleGenerate"
            :disabled="!aiDescription.trim() || isGenerating"
          >
            {{ isGenerating ? '生成中...' : '生成' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载动画 -->
    <div v-if="showLoading" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring-inner"></div>
          <div class="spinner-icon">
            <img src="/logo.png" alt="AI Mind" />
          </div>
        </div>
        <div class="loading-text">AI绘制启动中</div>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- 页面管理抽屉 -->
    <div v-if="showPageManager" class="page-drawer-overlay" @click="togglePageManager">
      <div class="page-drawer" @click.stop>
        <div class="drawer-header">
          <h3>我的页面</h3>
          <button class="close-btn" @click="togglePageManager">
            <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20">
              <path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <div class="drawer-actions">
          <button class="new-page-btn" @click="handleCreatePage">
            <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m192 472c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z" fill="currentColor"/>
            </svg>
            新建页面
          </button>
        </div>

        <div class="page-list">
          <div v-if="pageList.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 1024 1024" width="64" height="64">
              <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z" fill="#d9d9d9"/>
            </svg>
            <p>还没有保存的页面</p>
            <p class="tip">点击“新建页面”开始创作</p>
          </div>

          <div v-for="page in pageList" :key="page.id" 
               class="page-card"
               :class="{ active: page.id === currentPageId }"
               @click="handleLoadPage(page.id)">
            <div class="card-content">
              <div class="page-icon">
                <svg viewBox="0 0 1024 1024" width="24" height="24">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z" fill="currentColor"/>
                </svg>
              </div>
              <div class="page-info">
                <div class="page-title">{{ page.title }}</div>
                <div class="page-time">{{ formatTime(page.updateTime) }}</div>
              </div>
            </div>
            <div class="card-actions">
              <button class="icon-btn" @click.stop="handleRenamePage(page)" title="重命名">
                <svg viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9c3.9-3.9 3.9-10.2 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2c-1.9 11.1 1.5 21.9 9.4 29.8 6.6 6.4 14.9 9.9 23.8 9.9z m67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89z" fill="currentColor"/>
                </svg>
              </button>
              <button class="icon-btn delete" @click.stop="handleDeletePage(page.id)" title="删除">
                <svg viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72z" fill="currentColor"/>
                  <path d="M864 256H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32z m-200 600H360c-4.4 0-8-3.6-8-8V408c0-4.4 3.6-8 8-8h304c4.4 0 8 3.6 8 8v440c0 4.4-3.6 8-8 8z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义弹窗 -->
    <div v-if="showDialog" class="dialog-overlay" @click="handleDialogCancel">
      <div class="custom-dialog" @click.stop>
        <div class="dialog-header">
          <h3>{{ dialogConfig.title }}</h3>
        </div>
        
        <div class="dialog-body">
          <p v-if="dialogConfig.message" class="dialog-message">{{ dialogConfig.message }}</p>
          
          <input 
            v-if="dialogConfig.type === 'input'"
            v-model="dialogInput"
            type="text"
            class="dialog-input"
            :placeholder="dialogConfig.placeholder"
            @keyup.enter="handleDialogConfirm"
            autofocus
          />
        </div>
        
        <div class="dialog-footer">
          <button class="btn btn-default" @click="handleDialogCancel">取消</button>
          <button 
            class="btn btn-primary" 
            @click="handleDialogConfirm"
            :disabled="dialogConfig.type === 'input' && !dialogInput.trim()"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import MindElixir from 'mind-elixir'
import { mindmapApi } from '../api/mindmap'
import AIConfigButton from './AIConfigButton.vue'
import AIConfigDrawer from './AIConfigDrawer.vue'
import { getActiveProviderConfig } from '../utils/aiConfig'
import { mindmapDB } from '../utils/mindmapDB'
import { getAllTemplates } from '../utils/templates'

const mindmapContainer = ref(null)
const isAIDialogVisible = ref(false)
const aiDescription = ref('')
const isGenerating = ref(false)
const showLoading = ref(false)
const currentColor = ref('#0066FF')
const currentTheme = ref('鲜明蓝')
const showAIInput = ref(false)          // AI输入框显示状态
const showThemeMenu = ref(false)        // 主题菜单显示状态
const showLinkButtons = ref(true)       // 外部链接按钮显示状态
const mdFileInput = ref(null)           // MD文件输入引用
const showPageManager = ref(false)      // 页面管理面板显示状态
const pageList = ref([])                // 页面列表
const currentPageId = ref(null)         // 当前页面ID
let autoSaveTimer = null                // 自动保存定时器
const showTemplateMenu = ref(false)     // 模版菜单显示状态

// 弹窗相关状态
const showDialog = ref(false)
const dialogConfig = ref({
  type: 'input',  // input | confirm
  title: '',
  message: '',
  placeholder: '',
  defaultValue: '',
  onConfirm: null,
  onCancel: null
})
const dialogInput = ref('')

// 显示输入弹窗
const showInputDialog = (title, placeholder, defaultValue = '') => {
  return new Promise((resolve) => {
    dialogConfig.value = {
      type: 'input',
      title,
      message: '',
      placeholder,
      defaultValue,
      onConfirm: (value) => {
        showDialog.value = false
        resolve(value)
      },
      onCancel: () => {
        showDialog.value = false
        resolve(null)
      }
    }
    dialogInput.value = defaultValue
    showDialog.value = true
  })
}

// 显示确认弹窗
const showConfirmDialog = (title, message) => {
  return new Promise((resolve) => {
    dialogConfig.value = {
      type: 'confirm',
      title,
      message,
      placeholder: '',
      defaultValue: '',
      onConfirm: () => {
        showDialog.value = false
        resolve(true)
      },
      onCancel: () => {
        showDialog.value = false
        resolve(false)
      }
    }
    showDialog.value = true
  })
}

// 弹窗确认
const handleDialogConfirm = () => {
  if (dialogConfig.value.type === 'input') {
    if (dialogInput.value.trim()) {
      dialogConfig.value.onConfirm?.(dialogInput.value.trim())
    }
  } else {
    dialogConfig.value.onConfirm?.()
  }
}

// 弹窗取消
const handleDialogCancel = () => {
  dialogConfig.value.onCancel?.()
}

// 获取所有模版
const templates = getAllTemplates()

// 用户统计信息
const remaining = ref(null)             // 剩余次数
const totalUsers = ref(0)               // 总用户数

// AI配置抽屉显示状态
const showConfigDrawer = ref(false)

// 计算总用户数显示文本
const totalUsersText = computed(() => {
  if (totalUsers.value > 0) {
    return `${totalUsers.value}人使用`
  }
  return ''
})

// 主题配置 - 使用新的鲜明主色，包含背景色
const themes = [
  { name: '鲜明蓝', color: '#0066FF', bgcolor: '#F0F7FF', palette: ['#0066FF', '#00C853', '#FFB300', '#FF3D00', '#9C27B0'] },
  { name: '科技紫', color: '#9C27B0', bgcolor: '#F8F0FF', palette: ['#9C27B0', '#0066FF', '#00BCD4', '#00C853', '#FFB300'] },
  { name: '活力橙', color: '#FF6D00', bgcolor: '#FFF5E6', palette: ['#FF6D00', '#FFB300', '#00C853', '#0066FF', '#FF3D00'] },
  { name: '清新绿', color: '#00C853', bgcolor: '#F0FFF4', palette: ['#00C853', '#00BCD4', '#0066FF', '#9C27B0', '#FFB300'] },
  { name: '简约灰', color: '#424242', bgcolor: '#FAFAFA', palette: ['#424242', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0'] },
  { name: '樱花粉', color: '#FF4081', bgcolor: '#FFF0F5', palette: ['#FF4081', '#FF80AB', '#FFB3D1', '#E91E63', '#C2185B'] },
  { name: '深海蓝', color: '#006994', bgcolor: '#E6F7FF', palette: ['#006994', '#0088CC', '#00A9E0', '#00BCD4', '#4DD0E1'] },
  { name: '薄荷绿', color: '#00D4AA', bgcolor: '#E6FFF9', palette: ['#00D4AA', '#00E5CC', '#00FFC8', '#26A69A', '#00BFA5'] },
  { name: '落日橙', color: '#FF7043', bgcolor: '#FFF3E0', palette: ['#FF7043', '#FF8A65', '#FFAB91', '#FF5722', '#F4511E'] },
  { name: '皇家紫', color: '#7B1FA2', bgcolor: '#F3E5F5', palette: ['#7B1FA2', '#9C27B0', '#AB47BC', '#8E24AA', '#6A1B9A'] },
  { name: '晴空蓝', color: '#03A9F4', bgcolor: '#E1F5FE', palette: ['#03A9F4', '#29B6F6', '#4FC3F7', '#0288D1', '#0277BD'] },
  { name: '森林绿', color: '#2E7D32', bgcolor: '#E8F5E9', palette: ['#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A'] },
  { name: '暖阳黄', color: '#F9A825', bgcolor: '#FFFDE7', palette: ['#F9A825', '#FBC02D', '#FDD835', '#FFEB3B', '#FFEE58'] },
  { name: '勃艮第', color: '#880E4F', bgcolor: '#FCE4EC', palette: ['#880E4F', '#AD1457', '#C2185B', '#E91E63', '#EC407A'] },
  { name: '午夜蓝', color: '#1A237E', bgcolor: '#E8EAF6', palette: ['#1A237E', '#283593', '#303F9F', '#3949AB', '#3F51B5'] }
]

let mindInstance = null

// 初始化思维导图
const initMindmap = async () => {
  const options = {
    el: mindmapContainer.value,
    direction: MindElixir.RIGHT,
    draggable: true,
    contextMenu: true,
    toolBar: true,
    nodeMenu: true,
    keypress: true,
    locale: 'zh_CN',
    overflowHidden: false,
    mainLinkStyle: 2,
    mainNodeShape: 'rect',
    allowUndo: true,
    layoutOffset: { x: 0, y: 0 },
    theme: {
      name: 'vivid-blue-theme',
      palette: ['#0066FF', '#00C853', '#FFB300', '#FF3D00', '#9C27B0'],
      cssVar: {
        '--main-color': '#0066FF',
        '--main-bgcolor': '#ffffff',
        '--color': '#333333',
        '--bg': '#F0F7FF'
      }
    },
    before: {
      insertSibling(el, obj) {
        return true
      },
      async addChild(el, obj) {
        return true
      }
    }
  }

  const initialData = {
    nodeData: {
      id: 'root',
      topic: '开始创作',
      root: true,
      children: []
    }
  }

  mindInstance = new MindElixir(options)
  mindInstance.init(initialData)
  
  // 监听思维导图操作，触发自动保存
  mindInstance.bus.addListener('operation', handleAutoSave)
  
  // 初始化时自动创建默认文档
  await initDefaultDocument()
}

// 初始化默认文档
const initDefaultDocument = async () => {
  try {
    // 获取所有文档，按更新时间倒序
    const allDocs = await mindmapDB.getAllMindMaps()
    
    if (allDocs && allDocs.length > 0) {
      // 加载最新的文档
      const latestDoc = allDocs[0]
      currentPageId.value = latestDoc.id
      mindInstance.refresh(latestDoc.data)
      console.log('加载最新文档:', latestDoc.title)
      return
    }
    
    // 如果没有任何文档，创建默认文档
    const newId = await mindmapDB.createMindMap('未命名思维导图')
    currentPageId.value = newId
    console.log('创建默认文档')
  } catch (error) {
    console.error('初始化默认文档失败:', error)
  }
}

// 显示AI对话框
const showAIDialog = () => {
  isAIDialogVisible.value = true
}

// 切换AI输入框
const toggleAIInput = () => {
  showAIInput.value = !showAIInput.value
  if (!showAIInput.value) {
    aiDescription.value = ''
  }
}

// 使用示例
const useExample = (text) => {
  aiDescription.value = text
}

// 切换模版菜单
const toggleTemplateMenu = () => {
  showTemplateMenu.value = !showTemplateMenu.value
  // 关闭其他菜单
  if (showTemplateMenu.value) {
    showThemeMenu.value = false
  }
}

// 应用模版
const applyTemplate = (template) => {
  if (!mindInstance) return
  
  try {
    mindInstance.refresh(template.data)
    showTemplateMenu.value = false
    console.log('模版应用成功:', template.name)
  } catch (error) {
    console.error('应用模版失败:', error)
    alert('应用模版失败，请重试')
  }
}

// 切换主题菜单
const toggleThemeMenu = () => {
  showThemeMenu.value = !showThemeMenu.value
  // 关闭其他菜单
  if (showThemeMenu.value) {
    showTemplateMenu.value = false
  }
}

// 切换外部链接按钮显示
const toggleLinkButtons = () => {
  showLinkButtons.value = !showLinkButtons.value
}

// 切换主题
const changeTheme = (theme) => {
  currentTheme.value = theme.name
  currentColor.value = theme.color
  
  if (mindInstance) {
    // 更新思维导图主题
    mindInstance.theme = {
      name: theme.name,
      palette: theme.palette,
      cssVar: {
        '--main-color': theme.color,
        '--main-bgcolor': '#ffffff',
        '--color': '#333333',
        '--bg': theme.bgcolor
      }
    }
    mindInstance.refresh(mindInstance.getData())
  }
  
  // 更新画布背景色
  const container = document.getElementById('mindmap-container')
  if (container) {
    container.style.backgroundColor = theme.bgcolor
  }
  
  showThemeMenu.value = false
}

// 关闭AI对话框
const closeAIDialog = () => {
  isAIDialogVisible.value = false
  aiDescription.value = ''
}

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 获取用户统计信息
const fetchStats = async () => {
  try {
    const response = await mindmapApi.getStats()
    if (response.success && response.data) {
      remaining.value = response.data.remaining
      totalUsers.value = response.data.totalUsers
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
  }
}

// AI生成处理
const handleGenerate = async () => {
  if (!aiDescription.value.trim()) return

  try {
    isGenerating.value = true
    showLoading.value = true
    showAIInput.value = false  // 关闭输入框

    // 获取当前激活的AI配置
    const aiConfig = getActiveProviderConfig()
    
    // 日志输出（处理null情况）
    if (aiConfig) {
      console.log('使用自定义AI配置:', {
        provider: aiConfig.provider,
        model: aiConfig.model,
        hasApiKey: !!aiConfig.apiKey
      })
    } else {
      console.log('使用系统内置 DeepSeek 模型')
    }

    // 调用AI生成API，传入自定义配置（null时后端使用默认配置）
    const response = await mindmapApi.generateMindmap(
      aiDescription.value.trim(),
      aiConfig
    )
    
    if (response.success && response.data) {
      // 更新剩余次数
      if (response.remaining !== undefined) {
        remaining.value = response.remaining
      }
      
      await renderProgressively(response.data)
      console.log('思维导图生成成功')
      
      // 刷新统计信息
      await fetchStats()
    } else {
      // 处理次数限制错误
      if (response.remaining === 0) {
        alert(response.message || '今日使用次数已达上限（15次），请明天再来吧~')
        remaining.value = 0
      } else {
        alert(response.message || '生成失败，请重试')
      }
      showAIInput.value = true
    }
  } catch (error) {
    console.error('AI生成失败:', error)
    alert('生成失败，请重试')
    showAIInput.value = true  // 失败时重新显示输入框
  } finally {
    isGenerating.value = false
    showLoading.value = false
    aiDescription.value = ''
  }
}

// 逐步渲染思维导图
const renderProgressively = async (data) => {
  if (!mindInstance || !data.nodeData) return

  const { nodeData } = data
  
  // 1. 清空画布，显示临时根节点
  mindInstance.refresh({
    nodeData: {
      id: 'temp-root',
      topic: '生成中...',
      root: true,
      children: []
    }
  })
  await delay(300)

  // 关闭加载动画，开始节点渲染
  showLoading.value = false
  await delay(200)

  // 2. 渲染真实中心节点
  const currentData = {
    nodeData: {
      id: nodeData.id,
      topic: nodeData.topic,
      root: true,
      children: []
    }
  }
  mindInstance.refresh(currentData)
  await delay(400)

  // 3. 逐个添加主分支
  if (nodeData.children && nodeData.children.length > 0) {
    for (const branch of nodeData.children) {
      // 添加主分支（不含子节点）
      const branchNode = {
        id: branch.id,
        topic: branch.topic,
        direction: branch.direction,
        children: []
      }
      currentData.nodeData.children.push(branchNode)
      mindInstance.refresh(currentData)
      await delay(300)

      // 4. 逐个添加子节点
      if (branch.children && branch.children.length > 0) {
        const targetBranch = currentData.nodeData.children.find(c => c.id === branch.id)
        for (const child of branch.children) {
          targetBranch.children.push({
            id: child.id,
            topic: child.topic
          })
          mindInstance.refresh(currentData)
          await delay(200)
        }
      }
    }
  }
}

// AI配置保存回调
const handleConfigSaved = (config) => {
  console.log('AI配置已保存:', config)
  // 可以在这里显示一个提示
}

// 撤销操作
const handleUndo = () => {
  if (mindInstance) {
    try {
      mindInstance.undo()
    } catch (error) {
      console.log('撤销失败:', error)
    }
  }
}

// 重做操作
const handleRedo = () => {
  if (mindInstance) {
    try {
      mindInstance.redo()
    } catch (error) {
      console.log('重做失败:', error)
    }
  }
}

// 导出MD功能
const handleExportMD = () => {
  if (!mindInstance) return
  
  try {
    const data = mindInstance.getData()
    const markdown = convertToMarkdown(data.nodeData)
    
    // 创建下载blob
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${data.nodeData.topic || '思维导图'}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('导出MD成功')
  } catch (error) {
    console.error('导出MD失败:', error)
    alert('导出失败，请重试')
  }
}

// 将思维导图数据转换为Markdown
const convertToMarkdown = (node, level = 0) => {
  if (!node) return ''
  
  let markdown = ''
  const indent = '  '.repeat(level)
  
  if (level === 0) {
    // 根节点使用一级标题
    markdown = `# ${node.topic}\n\n`
  } else {
    // 子节点使用列表
    markdown = `${indent}- ${node.topic}\n`
  }
  
  // 递归处理子节点
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      markdown += convertToMarkdown(child, level + 1)
    }
  }
  
  return markdown
}

// 导入MD功能
const handleImportMD = () => {
  if (mdFileInput.value) {
    mdFileInput.value.click()
  }
}

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const nodeData = convertFromMarkdown(text)
    
    if (mindInstance && nodeData) {
      mindInstance.refresh({ nodeData })
      console.log('导入MD成功')
    }
  } catch (error) {
    console.error('导入MD失败:', error)
    alert('导入失败，请确保文件格式正确')
  }
  
  // 清空输入，允许重复导入同一文件
  event.target.value = ''
}

// 将Markdown转换为思维导图数据
const convertFromMarkdown = (markdown) => {
  const lines = markdown.split('\n').filter(line => line.trim())
  if (lines.length === 0) return null
  
  // 解析第一行作为根节点
  const firstLine = lines[0].trim()
  const rootTopic = firstLine.replace(/^#+\s*/, '') || '思维导图'
  
  const root = {
    id: 'root',
    topic: rootTopic,
    root: true,
    children: []
  }
  
  // 解析列表项
  const stack = [{ node: root, level: -1 }]
  let nodeId = 1
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^(\s*)-\s+(.+)$/)
    
    if (match) {
      const indent = match[1].length
      const level = Math.floor(indent / 2)
      const topic = match[2].trim()
      
      const newNode = {
        id: `node-${nodeId++}`,
        topic: topic,
        children: []
      }
      
      // 找到父节点
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }
      
      if (stack.length > 0) {
        const parent = stack[stack.length - 1].node
        
        // 为主分支添加direction属性
        if (parent === root) {
          newNode.direction = parent.children.length % 2 === 0 ? 0 : 1
        }
        
        parent.children.push(newNode)
        stack.push({ node: newNode, level: level })
      }
    }
  }
  
  return root
}

// 清空画布
const handleClearCanvas = async () => {
  const confirmed = await showConfirmDialog('清空画布', '确定要清空画布吗？这将删除所有内容！')
  if (!confirmed) return
  
  try {
    const initialData = {
      nodeData: {
        id: 'root',
        topic: '开始创作',
        root: true,
        children: []
      }
    }
    
    mindInstance.refresh(initialData)
    // 不清除currentPageId，保持自动保存功能
    console.log('画布已清空')
  } catch (error) {
    console.error('清空画布失败:', error)
    alert('清空失败，请重试')
  }
}

// 自动保存处理函数
const handleAutoSave = () => {
  // 清除之前的定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  // 设置新的定时器，2秒后保存
  autoSaveTimer = setTimeout(async () => {
    await autoSavePage()
  }, 2000)
}

// 执行自动保存
const autoSavePage = async () => {
  if (!mindInstance) return
  
  try {
    const rawData = mindInstance.getData()
    const cleanData = cleanDataForStorage(rawData)
    
    if (!currentPageId.value) {
      const newId = await mindmapDB.createMindMap('未命名思维导图')
      currentPageId.value = newId
      const page = await mindmapDB.getMindMap(newId)
      if (page) {
        page.data = cleanData
        await mindmapDB.saveMindMap(page)
      }
      console.log('自动创建并保存文档')
      return
    }
    
    const currentPage = await mindmapDB.getMindMap(currentPageId.value)
    
    if (currentPage) {
      currentPage.data = cleanData
      await mindmapDB.saveMindMap(currentPage)
      console.log('自动保存成功')
    } else {
      const newId = await mindmapDB.createMindMap('未命名思维导图')
      currentPageId.value = newId
      const page = await mindmapDB.getMindMap(newId)
      if (page) {
        page.data = cleanData
        await mindmapDB.saveMindMap(page)
      }
      console.log('自动创建新文档')
    }
  } catch (error) {
    console.error('自动保存失败:', error)
  }
}

// 切换页面管理面板
const togglePageManager = async () => {
  showPageManager.value = !showPageManager.value
  if (showPageManager.value) {
    await loadPageList()
  }
}

// 加载页面列表
const loadPageList = async () => {
  try {
    const list = await mindmapDB.getAllMindMaps()
    pageList.value = list
  } catch (error) {
    console.error('加载页面列表失败:', error)
    alert('加载失败，请重试')
  }
}

// 创建新页面
const handleCreatePage = async () => {
  const title = await showInputDialog('新建页面', '请输入页面名称', '未命名思维导图')
  if (!title) return
  
  try {
    // 先保存当前编辑内容
    if (currentPageId.value) {
      await autoSavePage()
    }
    
    const pageId = await mindmapDB.createMindMap(title)
    await loadPageList()
    await handleLoadPage(pageId)
    console.log('页面创建成功')
  } catch (error) {
    console.error('创建页面失败:', error)
    alert('创建失败，请重试')
  }
}

// 加载页面
const handleLoadPage = async (pageId) => {
  if (!mindInstance) return
  
  try {
    // 先保存当前页面
    if (currentPageId.value && currentPageId.value !== pageId) {
      await autoSavePage()
    }
    
    const page = await mindmapDB.getMindMap(pageId)
    if (page && page.data) {
      mindInstance.refresh(page.data)
      currentPageId.value = pageId
      showPageManager.value = false
      console.log('页面加载成功')
      
      // 加载页面后重新加载列表（更新激活状态）
      await loadPageList()
    }
  } catch (error) {
    console.error('加载页面失败:', error)
    alert('加载失败，请重试')
  }
}

// 深度克隆清洗数据，移除不可序列化内容
const cleanDataForStorage = (data) => {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    console.error('数据清洗失败:', error)
    return data
  }
}

// 重命名页面
const handleRenamePage = async (page) => {
  const newTitle = await showInputDialog('重命名页面', '请输入新名称', page.title)
  if (!newTitle || newTitle === page.title) return
  
  try {
    const updateData = {
      id: page.id,
      title: newTitle,
      data: cleanDataForStorage(page.data),
      createTime: page.createTime,
      updateTime: page.updateTime
    }
    
    await mindmapDB.saveMindMap(updateData)
    await loadPageList()
    console.log('重命名成功')
  } catch (error) {
    console.error('重命名失败:', error)
    alert(`重命名失败: ${error.message}`)
  }
}

// 删除页面
const handleDeletePage = async (pageId) => {
  const confirmed = await showConfirmDialog('删除页面', '确定要删除这个页面吗？此操作不可恢复。')
  if (!confirmed) return
  
  try {
    await mindmapDB.deleteMindMap(pageId)
    
    if (currentPageId.value === pageId) {
      // 删除当前页面后，尝试加载其他页面
      const allDocs = await mindmapDB.getAllMindMaps()
      if (allDocs && allDocs.length > 0) {
        await handleLoadPage(allDocs[0].id)
      } else {
        // 没有其他页面，创建新的空页面
        currentPageId.value = null
        const initialData = {
          nodeData: {
            id: 'root',
            topic: '开始创作',
            root: true,
            children: []
          }
        }
        mindInstance.refresh(initialData)
        await initDefaultDocument()
      }
    }
    
    await loadPageList()
    console.log('页面删除成功')
  } catch (error) {
    console.error('删除页面失败:', error)
    alert('删除失败，请重试')
  }
}

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  
  return date.toLocaleDateString('zh-CN')
}

// 工具栏操作（已移除，使用Mind-Elixir自带工具栏）

onMounted(() => {
  initMindmap()
  fetchStats()  // 组件挂载时获取统计信息
})

onUnmounted(() => {
  // 清除自动保存定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  // 移除事件监听
  if (mindInstance && mindInstance.bus) {
    mindInstance.bus.removeListener('operation', handleAutoSave)
  }
  
  if (mindInstance) {
    mindInstance = null
  }
})
</script>

<style scoped lang="less">
@import '../styles/variables.less';

.mindmap-editor {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 悬浮顶部操作栏 */
.floating-toolbar {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  height: auto;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  z-index: 100;

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
    right: 10px;
    flex-direction: column;
    gap: 8px;
  }

  .toolbar-left {
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
      background: white;
      padding: 8px 12px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .logo {
      width: 32px;
      height: 32px;
      object-fit: contain;

      @media (max-width: 768px) {
        width: 28px;
        height: 28px;
      }
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      color: @primary-color;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        font-size: 18px;
      }
    }

    .user-stats {
      margin-left: 8px;
      font-size: 13px;
      color: @text-secondary;
      background: rgba(0, 102, 255, 0.08);
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;

      @media (max-width: 768px) {
        font-size: 11px;
        padding: 4px 8px;
      }
    }
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 8px;
      padding-bottom: 4px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .unified-action-group {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid @border-color;
      border-radius: 24px;
      padding: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;

      @media (max-width: 768px) {
        flex-wrap: nowrap;
        padding: 4px;
        border-radius: 20px;
        min-width: max-content;
      }

      &:hover {
        box-shadow: 0 2px 12px rgba(0, 102, 255, 0.15);
        border-color: rgba(0, 102, 255, 0.2);
      }

      .group-btn {
        position: relative;
        height: 36px;
        border: none;
        background: transparent;
        color: @text-color;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-radius: 18px;
        transition: all 0.3s;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 500;

        @media (max-width: 768px) {
          height: 32px;
          padding: 0 10px;
          font-size: 13px;
          gap: 4px;

          .btn-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          height: 30px;
          padding: 0 8px;
        }

        .icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          transition: transform 0.3s;

          @media (max-width: 768px) {
            width: 16px;
            height: 16px;
          }
        }

        .btn-text {
          white-space: nowrap;
        }

        .badge {
          font-size: 12px;
          padding: 2px 6px;
          background: rgba(0, 102, 255, 0.1);
          color: @primary-color;
          border-radius: 10px;
          font-weight: 600;

          @media (max-width: 768px) {
            font-size: 10px;
            padding: 2px 4px;
          }
        }

        &:hover {
          background: @primary-color;
          color: white;

          .icon {
            transform: scale(1.1);
          }

          .badge {
            background: rgba(255, 255, 255, 0.25);
            color: white;
          }
        }

        &:active {
          transform: scale(0.95);
        }

        &.ai-btn {
          min-width: 100px;

          @media (max-width: 768px) {
            min-width: auto;
          }
        }

        &.template-btn {
          position: relative;
          min-width: 90px;
          
          @media (max-width: 768px) {
            min-width: auto;
          }
          
          .hot-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            font-size: 10px;
            padding: 2px 6px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
            color: white;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(255, 71, 87, 0.4);
            border: 1.5px solid white;
            line-height: 1;
            animation: pulse 2s ease-in-out infinite;

            @media (max-width: 768px) {
              font-size: 8px;
              padding: 1px 4px;
              top: -2px;
              right: -2px;
            }
          }
        }

        /* Tooltip样式增强 */
        &::after {
          content: attr(title);
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
          border-radius: 6px;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1000;

          @media (max-width: 768px) {
            display: none;
          }
        }

        &::before {
          content: '';
          position: absolute;
          top: calc(100% + 2px);
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: rgba(0, 0, 0, 0.85);
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1000;

          @media (max-width: 768px) {
            display: none;
          }
        }

        &:hover::after,
        &:hover::before {
          opacity: 1;
          visibility: visible;
        }

        &[title=""]::after,
        &[title=""]::before {
          display: none;
        }
      }

      .theme-selector-inline {
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
        height: 36px;
        padding: 0 12px;
        cursor: pointer;
        border-radius: 18px;
        transition: all 0.3s;

        @media (max-width: 768px) {
          height: 32px;
          padding: 0 10px;
          gap: 4px;

          .theme-text {
            display: none;
          }
        }

        /* Tooltip样式 */
        &::after {
          content: attr(title);
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
          border-radius: 6px;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1000;
        }

        &::before {
          content: '';
          position: absolute;
          top: calc(100% + 2px);
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: rgba(0, 0, 0, 0.85);
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1000;
        }

        &:hover::after,
        &:hover::before {
          opacity: 1;
          visibility: visible;
        }

        .color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          flex-shrink: 0;

          @media (max-width: 768px) {
            width: 16px;
            height: 16px;
          }
        }

        .theme-text {
          font-size: 14px;
          color: @text-color;
          white-space: nowrap;
          font-weight: 500;
        }

        .arrow-icon {
          width: 12px;
          height: 12px;
          color: @text-secondary;
          transition: transform 0.3s;
        }

        &:hover {
          background: @primary-color;
          
          .theme-text {
            color: white;
          }

          .arrow-icon {
            color: white;
          }
        }

        .theme-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid @border-color;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          padding: 8px;
          min-width: 160px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;

          @media (max-width: 768px) {
            right: auto;
            left: 50%;
            transform: translateX(-50%);
            width: 90vw;
            max-width: 280px;
          }

          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }

          &::-webkit-scrollbar-thumb {
            background: #d0d0d0;
            border-radius: 3px;

            &:hover {
              background: #b0b0b0;
            }
          }

          .theme-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              background: @bg-color;
            }

            &.active {
              background: #e6f7ff;
            }

            .theme-dot {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              flex-shrink: 0;
            }

            span {
              flex: 1;
              font-size: 14px;
              color: @text-color;
            }

            .check-icon {
              width: 14px;
              height: 14px;
              flex-shrink: 0;
            }
          }
        }
      }

      .divider {
        width: 1px;
        height: 20px;
        background: @border-color;
        margin: 0 4px;
      }

      // 模版菜单样式
      .template-menu {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        width: 420px;
        background: white;
        border: 1px solid @border-color;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        z-index: 1000;
        overflow: hidden;
        animation: slideDownFade 0.3s ease;

        @media (max-width: 768px) {
          right: auto;
          left: 50%;
          transform: translateX(-50%);
          width: 90vw;
          max-width: 360px;
        }

        .menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid @border-color;
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);

          @media (max-width: 768px) {
            padding: 12px 16px;
          }

          .menu-title {
            font-size: 16px;
            font-weight: 600;
            color: @text-color;

            @media (max-width: 768px) {
              font-size: 15px;
            }
          }

          .close-menu-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            color: @text-secondary;
            cursor: pointer;
            font-size: 20px;
            border-radius: 4px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
              background: rgba(0, 0, 0, 0.05);
              color: @text-color;
            }
          }
        }

        .template-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 12px;

          @media (max-width: 768px) {
            max-height: 60vh;
            padding: 10px;
          }

          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-track {
            background: transparent;
          }

          &::-webkit-scrollbar-thumb {
            background: #d0d0d0;
            border-radius: 3px;

            &:hover {
              background: #b0b0b0;
            }
          }

          .template-item {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 14px;
            border: 1px solid @border-color;
            border-radius: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s;
            background: white;

            @media (max-width: 768px) {
              gap: 10px;
              padding: 10px;
            }

            &:last-child {
              margin-bottom: 0;
            }

            .template-icon {
              width: 48px;
              height: 48px;
              flex-shrink: 0;
              background: white;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0, 102, 255, 0.08);
              border: 1px solid rgba(0, 102, 255, 0.1);
              
              @media (max-width: 768px) {
                width: 40px;
                height: 40px;
              }
              
              svg {
                width: 32px;
                height: 32px;

                @media (max-width: 768px) {
                  width: 24px;
                  height: 24px;
                }
              }
            }

            .template-info {
              flex: 1;
              min-width: 0;

              .template-name {
                font-size: 15px;
                font-weight: 600;
                color: @text-color;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 6px;

                @media (max-width: 768px) {
                  font-size: 14px;
                  margin-bottom: 4px;
                }
              }

              .template-desc {
                font-size: 13px;
                color: @text-secondary;
                line-height: 1.5;

                @media (max-width: 768px) {
                  font-size: 12px;
                  line-height: 1.4;
                }
              }
            }

            &:hover {
              border-color: @primary-color;
              background: rgba(0, 102, 255, 0.02);
              box-shadow: 0 4px 12px rgba(0, 102, 255, 0.12);
              transform: translateY(-2px);

              .template-icon {
                box-shadow: 0 4px 12px rgba(0, 102, 255, 0.2);
              }
            }
          }
        }
      }

      .divider {
        width: 1px;
        height: 24px;
        background: @border-color;
        margin: 0 4px;
        flex-shrink: 0;
      }
    }

    .ai-input-wrapper {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 100;
    }

    .ai-input-container {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
      padding: 4px;
      border-radius: 24px;
      box-shadow: 0 8px 24px rgba(0, 102, 255, 0.12), 0 0 0 1px rgba(0, 102, 255, 0.1);
      min-width: 480px;
      max-width: 580px;
      transition: all 0.3s ease;

      &:focus-within {
        box-shadow: 0 8px 32px rgba(0, 102, 255, 0.2), 0 0 0 2px @primary-color;
      }

      .input-wrapper {
        flex: 1;
        background: white;
        border-radius: 20px;
        overflow: hidden;

        .ai-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 14px;
          line-height: 20px;
          padding: 8px 16px;
          height: 36px;
          font-family: inherit;
          background: transparent;
          color: @text-color;

          &::placeholder {
            color: #999;
          }
        }
      }

      .button-group {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .send-btn {
        width: 36px;
        height: 36px;
        min-width: 36px;
        min-height: 36px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        padding: 0;
        box-shadow: 0 2px 8px rgba(0, 102, 255, 0.3);

        .send-icon {
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
        }

        &:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(0, 102, 255, 0.4);
        }

        &:active:not(:disabled) {
          transform: scale(0.95);
        }

        &:disabled {
          background: linear-gradient(135deg, #d9d9d9 0%, #bfbfbf 100%);
          cursor: not-allowed;
          opacity: 0.6;
          box-shadow: none;
        }
      }

      .close-btn {
        width: 28px;
        height: 28px;
        min-width: 28px;
        min-height: 28px;
        border-radius: 50%;
        border: none;
        background: rgba(0, 0, 0, 0.04);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @text-secondary;
        transition: all 0.3s ease;
        padding: 0;

        .close-icon {
          font-size: 20px;
          line-height: 1;
        }

        &:hover {
          background: rgba(0, 0, 0, 0.08);
          color: @text-color;
          transform: rotate(90deg);
        }
      }
    }

    .example-prompts {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 4px;

      .example-item {
        font-size: 12px;
        color: @text-secondary;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;
        user-select: none;

        &:hover {
          color: @primary-color;
          background: rgba(0, 102, 255, 0.05);
        }
      }
    }

    .link-buttons-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .link-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .link-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid @border-color;
      border-radius: 4px;
      background: white;
      color: @text-color;
      text-decoration: none;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;

      .icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      span {
        white-space: nowrap;
      }

      &:hover {
        border-color: @primary-color;
        color: @primary-color;
        box-shadow: 0 2px 12px rgba(0, 102, 255, 0.25);
        transform: translateY(-1px);
      }
    }

    .toggle-btn {
      width: 36px;
      height: 36px;
      border: 1px solid @border-color;
      border-radius: 4px;
      background: white;
      color: @text-color;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      padding: 0;

      .icon {
        width: 16px;
        height: 16px;
        transition: all 0.3s;
      }

      &:hover {
        border-color: @primary-color;
        color: @primary-color;
        box-shadow: 0 2px 12px rgba(0, 102, 255, 0.25);
      }
    }
  }
}

/* 滑动淡入淡出动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* 左下角版权信息 */
.copyright-info {
  position: fixed;
  left: 20px;
  bottom: 20px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  color: @text-secondary;
  z-index: 50;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

#mindmap-container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F0F7FF;
  transition: background-color 0.3s ease;
}

/* Mind-Elixir 样式覆盖 */
:deep(.mind-elixir) {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
}

:deep(.mind-elixir svg) {
  overflow: visible;
}

/* Mind-Elixir 工具栏样式 */
:deep(.map-toolbar) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid @border-color;
  padding: 8px;
  right: 20px !important;
  bottom: 80px !important;     /* 向上移动到80px */
}

:deep(.map-toolbar button) {
  color: @text-color;
  border-radius: 6px;
  transition: all 0.3s;
}

:deep(.map-toolbar button:hover) {
  background: @primary-color;
  color: white;
}

:deep(.map-toolbar button.disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 左上角控制具柄位置调整 */
:deep(.svg-wrapper) {
  left: 20px !important;
  top: 80px !important;        /* 下移避免遮挡标题 */
}

:deep(.mind-elixir-node) {
  padding: 8px 16px;
  border-radius: 6px;
  background: #ffffff;
  border: 2px solid #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  font-size: 14px;
  color: #333;
  transition: all 0.3s;
}

:deep(.mind-elixir-node:hover) {
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
  transform: translateY(-2px);
}

:deep(.mind-elixir-root) {
  background: #1890ff;
  color: #ffffff;
  border-color: #0050b3;
  font-weight: 500;
  font-size: 16px;
  padding: 12px 24px;
}

:deep(.mind-elixir-line) {
  stroke: #1890ff;
  stroke-width: 2px;
}

/* AI对话框样式 */
.ai-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ai-dialog {
  width: 520px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  
  .ai-dialog-header {
    padding: 20px 24px;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-size: 18px;
      font-weight: 500;
      color: @text-color;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      color: @text-secondary;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: @text-color;
      }
    }
  }

  .ai-dialog-body {
    padding: 24px;

    .ai-input {
      width: 100%;
      padding: 12px;
      border: 1px solid @border-color;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      transition: all 0.3s;

      &:focus {
        outline: none;
        border-color: @primary-color;
      }

      &::placeholder {
        color: @text-light;
      }
    }

    .ai-tips {
      margin-top: 12px;
      padding: 8px 12px;
      background: #e6f7ff;
      border-left: 3px solid @primary-color;
      border-radius: 4px;
      font-size: 13px;
      color: @text-secondary;
      display: flex;
      align-items: center;
      gap: 8px;

      .tip-icon {
        font-size: 16px;
      }
    }
  }

  .ai-dialog-footer {
    padding: 16px 24px;
    border-top: 1px solid @border-color;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

/* 加载动画 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-container {
  text-align: center;
}

.loading-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;

  .spinner-ring {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid @primary-light;
    border-radius: 50%;
    animation: rotate 3s linear infinite;
  }

  .spinner-ring-inner {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid @primary-color;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .spinner-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: float 2s ease-in-out infinite;

    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      filter: drop-shadow(0 2px 8px rgba(0, 102, 255, 0.3));
    }
  }
}

.loading-text {
  font-size: 16px;
  color: @text-color;
  font-weight: 500;
  margin-bottom: 12px;
}

.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  span {
    width: 8px;
    height: 8px;
    background: @primary-color;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 页面管理抽屉 */
.page-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.page-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease;

  .drawer-header {
    padding: 24px;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: @text-color;
      margin: 0;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: @text-secondary;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      .icon {
        width: 20px;
        height: 20px;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: @text-color;
      }
    }
  }

  .drawer-actions {
    padding: 20px;
    border-bottom: 1px solid @border-color;

    .new-page-btn {
      width: 100%;
      height: 44px;
      border: none;
      background: @primary-color;
      color: white;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0, 102, 255, 0.2);

      .icon {
        width: 18px;
        height: 18px;
      }

      &:hover {
        background: @primary-dark;
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .page-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d0d0d0;
      border-radius: 3px;

      &:hover {
        background: #b0b0b0;
      }
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: @text-secondary;

      .empty-icon {
        margin-bottom: 20px;
        opacity: 0.4;
      }

      .empty-title {
        margin: 12px 0 8px;
        font-size: 15px;
        font-weight: 500;
        color: @text-color;
      }

      .empty-tip {
        font-size: 13px;
        color: @text-light;
        margin: 0;
      }
    }

    .page-card {
      padding: 16px;
      border: 1px solid @border-color;
      border-radius: 10px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s;
      background: white;

      &:hover {
        border-color: @primary-color;
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.08);
        transform: translateY(-2px);

        .card-actions {
          opacity: 1;
        }
      }

      &.active {
        border-color: @primary-color;
        background: rgba(0, 102, 255, 0.04);
        box-shadow: 0 2px 8px rgba(0, 102, 255, 0.1);
      }

      .card-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;

        .page-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: @primary-color;
        }

        .page-info {
          flex: 1;
          min-width: 0;

          .page-title {
            font-size: 15px;
            font-weight: 500;
            color: @text-color;
            margin-bottom: 6px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .page-time {
            font-size: 12px;
            color: @text-secondary;
          }
        }
      }

      .card-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        opacity: 0;
        transition: all 0.3s;

        .icon-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(0, 0, 0, 0.04);
          color: @text-secondary;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          padding: 0;

          svg {
            width: 16px;
            height: 16px;
          }

          &:hover {
            background: rgba(0, 102, 255, 0.1);
            color: @primary-color;
          }

          &.delete:hover {
            background: #fff1f0;
            color: #ff4d4f;
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 6px rgba(255, 71, 87, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.6);
  }
}

@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自定义弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

.custom-dialog {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 420px;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  .dialog-header {
    padding: 20px 24px;
    border-bottom: 1px solid @border-color;
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: @primary-color;
    }
  }

  .dialog-body {
    padding: 24px;

    .dialog-message {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: @text-secondary;
      line-height: 1.6;
    }

    .dialog-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid @border-color;
      border-radius: 12px;
      font-size: 14px;
      outline: none;
      transition: all 0.3s ease;
      box-sizing: border-box;

      &:focus {
        border-color: @primary-color;
        background: #f0f7ff;
      }

      &::placeholder {
        color: #bbb;
      }
    }
  }

  .dialog-footer {
    padding: 16px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    background: #fafafa;
    border-top: 1px solid @border-color;

    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 80px;

      &.btn-default {
        background: white;
        color: @text-secondary;
        border: 1px solid @border-color;

        &:hover {
          background: #f5f5f5;
          border-color: #d0d0d0;
        }
      }

      &.btn-primary {
        background: linear-gradient(135deg, @primary-color 0%, #0052cc 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(0, 102, 255, 0.3);

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 移动端专用样式 */
@media (max-width: 768px) {
  /* AI输入框移动端优化 */
  .ai-input-wrapper {
    top: auto !important;
    bottom: 20px !important;
    width: calc(100% - 40px) !important;
    max-width: 500px !important;

    .ai-input-container {
      flex-direction: column;
      border-radius: 20px !important;

      .input-wrapper {
        padding: 0 16px !important;

        .ai-input {
          font-size: 14px !important;
          padding: 14px 0 !important;
        }
      }

      .button-group {
        width: 100%;
        padding: 8px !important;
        border-top: 1px solid @border-color;

        .send-btn {
          flex: 1;
          border-radius: 12px !important;
          height: 36px !important;
        }

        .close-btn {
          border-radius: 12px !important;
          height: 36px !important;
          width: 36px !important;
        }
      }
    }

    .example-prompts {
      margin-top: 10px;
      gap: 6px;

      .example-item {
        padding: 5px 12px !important;
        font-size: 12px !important;
      }
    }
  }

  /* 外部链接按钮移动端隐藏 */
  .link-buttons-wrapper {
    display: none !important;
  }

  /* 版权信息移动端优化 */
  .copyright-info {
    left: 10px !important;
    bottom: 10px !important;
    font-size: 11px !important;
    padding: 6px 12px !important;
  }

  /* Mind-Elixir工具栏移动端优化 */
  :deep(.map-toolbar) {
    right: 10px !important;
    bottom: 100px !important;
    padding: 6px !important;

    button {
      width: 32px !important;
      height: 32px !important;
      font-size: 14px !important;
    }
  }

  /* 左上角控制具柄移动端优化 */
  :deep(.svg-wrapper) {
    left: 10px !important;
    top: 100px !important;
    
    svg {
      width: 100px !important;
      height: 100px !important;
    }
  }

  /* 页面抽屉移动端优化 */
  .page-drawer {
    width: 90vw !important;
    max-width: 360px !important;
  }
}

@media (max-width: 480px) {
  /* 小屏幕设备额外优化 */
  .floating-toolbar {
    top: 8px !important;
    left: 8px !important;
    right: 8px !important;

    .toolbar-left {
      padding: 6px 10px !important;

      .logo {
        width: 24px !important;
        height: 24px !important;
      }

      .title {
        font-size: 16px !important;
      }

      .user-stats {
        font-size: 10px !important;
        padding: 3px 6px !important;
      }
    }
  }

  :deep(.map-toolbar) {
    bottom: 90px !important;
  }
}
</style>
