# OnlineURLPlayer 播放器体验优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 优化 OnlineURLPlayer 网站的播放器体验，包括主题切换、控件样式、响应式适配、加载状态和多语言支持

**Architecture:** 保持单文件架构（index.html），通过 CSS 变量实现主题切换，使用 Tailwind 响应式类名适配不同设备，通过 i18n 对象实现多语言支持

**Tech Stack:** HTML5, Tailwind CSS (CDN), ArtPlayer.js, Hls.js, CSS Variables, LocalStorage

---

## 文件结构

**主要文件：**
- `index.html` - 主页面文件（所有功能都在此文件中实现）

**文档文件：**
- `docs/superpowers/specs/2026-06-08-player-ux-optimization-design.md` - 设计文档
- `docs/superpowers/plans/2026-06-08-player-ux-optimization.md` - 本实施计划

---

## Task 1: 基础 HTML 结构与 CSS 变量定义

**Files:**
- Create: `index.html`

- [ ] **Step 1: 创建基础 HTML 结构**

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Online Video Player from URL - Play Video Online from Link</title>
    <meta name="description" content="Free online video player from URL. Easily play, stream and test MP4, M3U8, HLS, and WebM video links online instantly. Safe, fast, and no installation required.">
    
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

    <style>
        /* 避免播放器组件加载前的闪烁 */
        #player-container { background-color: #000; min-height: 480px; }
        
        /* 主题变量 */
        :root, [data-theme="light"] {
          --bg-primary: #f8fafc;
          --bg-secondary: #ffffff;
          --bg-player: #000000;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --border-color: #e2e8f0;
          --accent: #2563eb;
          --accent-hover: #1d4ed8;
        }

        [data-theme="dark"] {
          --bg-primary: #0f172a;
          --bg-secondary: #1e293b;
          --bg-player: #000000;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --border-color: #334155;
          --accent: #3b82f6;
          --accent-hover: #60a5fa;
        }

        /* 使用主题变量 */
        body {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .bg-secondary {
          background-color: var(--bg-secondary);
        }
        
        .border-theme {
          border-color: var(--border-color);
        }
        
        .text-primary {
          color: var(--text-primary);
        }
        
        .text-secondary {
          color: var(--text-secondary);
        }
        
        .accent {
          color: var(--accent);
        }
        
        .accent-bg {
          background-color: var(--accent);
        }
        
        .accent-bg:hover {
          background-color: var(--accent-hover);
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 font-sans min-h-screen antialiased flex flex-col">

    <nav class="bg-white border-b border-slate-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <span class="font-bold text-xl tracking-tight text-blue-600">OnlineURLPlayer<span class="text-slate-400 text-xs font-normal ml-1">.com</span></span>
            <div class="flex items-center gap-4 text-sm font-medium text-slate-600">
                <a href="#faq" class="hover:text-blue-600 transition-colors" data-i18n="nav_faq">FAQ</a>
                <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold" data-i18n="nav_safe">Client-Side Safe</span>
            </div>
        </div>
    </nav>

    <main class="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
        
        <header class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3" data-i18n="hero_title">
                Play Video from URL Online
            </h1>
            <p class="text-base text-slate-500 max-w-xl mx-auto" data-i18n="hero_subtitle">
                Fast, free, and web-based video player from link. Perfect for testing streams and instant playback.
            </p>
        </header>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
            <div class="flex flex-col sm:flex-row gap-3">
                <input type="url" id="video-url" 
                       class="flex-grow border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                       data-i18n="input_placeholder"
                       placeholder="Paste video URL here (e.g., https://example.com/movie.mp4 or .m3u8)" required>
                <button onclick="loadVideo()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg text-base cursor-pointer shadow-sm transition-all text-center whitespace-nowrap"
                        data-i18n="btn_play">
                    Play Now
                </button>
            </div>
            
            <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <input type="checkbox" id="use-proxy" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                <label for="use-proxy" class="cursor-pointer select-none">
                    <span data-i18n="proxy_label">Enable Stream Proxy</span> 
                    <span class="text-slate-400" data-i18n="proxy_hint">(Check this if your link fails due to CORS or Anti-leech errors)</span>
                </label>
            </div>
        </div>

        <div id="player-container" class="w-full rounded-xl shadow-lg overflow-hidden border border-slate-900 mb-6 aspect-video"></div>

        <div id="history-box" class="bg-white rounded-xl border border-slate-200 p-5 mb-12 shadow-sm hidden">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3" data-i18n="history_title">Recent Links</h3>
            <div id="history-list" class="flex flex-col gap-2.5"></div>
        </div>

        <div class="w-full bg-slate-100 rounded-lg p-3 text-center mb-12 border border-dashed border-slate-300">
            <span class="text-xs text-slate-400 tracking-widest block mb-2 uppercase">Advertisement</span>
            <div class="min-h-[90px] flex items-center justify-center text-slate-300 text-sm">
                Ad Slot Placeholder (Below Player)
            </div>
        </div>

        <section id="faq" class="border-t border-slate-200 pt-10 scroll-mt-6">
            <h2 class="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight text-center sm:left" data-i18n="faq_title">Frequently Asked Questions</h2>
            <div class="grid gap-4">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <h3 class="text-base font-bold text-slate-900 mb-2" data-i18n="faq1_q">How do I use this online video player from URL?</h3>
                    <p class="text-sm text-slate-600 leading-relaxed" data-i18n="faq1_a">Simply paste your direct video link (URL) into the input field above and click the "Play Now" button. Our player instantly detects the container format and loads your media stream within milliseconds. No registration or software downloads required.</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <h3 class="text-base font-bold text-slate-900 mb-2" data-i18n="faq2_q">Does this player support M3U8 and HLS network resources?</h3>
                    <p class="text-sm text-slate-600 leading-relaxed" data-i18n="faq2_a">Yes, absolutely. This link player natively integrates streaming support for M3U8, HLS live broadcasts, and standard MP4/WebM resources. It serves as a professional, lightweight stream testing tool tailored for developers and video engineers globally.</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <h3 class="text-base font-bold text-slate-900 mb-2" data-i18n="faq3_q">Is it safe to paste and play private links on this website?</h3>
                    <p class="text-sm text-slate-600 leading-relaxed" data-i18n="faq3_a">Your data privacy is completely guaranteed. This application functions 100% on the client-side. The URLs you paste are evaluated and resolved entirely inside your local browser and are never transmitted to any external backend server or database.</p>
                </div>
            </div>
        </section>

        <div class="w-full bg-slate-100 rounded-lg p-3 text-center mt-8 border border-dashed border-slate-300">
            <span class="text-xs text-slate-400 tracking-widest block mb-2 uppercase">Advertisement</span>
            <div class="min-h-[90px] flex items-center justify-center text-slate-300 text-sm">
                Ad Slot Placeholder (Bottom Page)
            </div>
        </div>

    </main>

    <footer class="bg-white border-t border-slate-200 mt-auto">
        <div class="max-w-5xl mx-auto px-4 h-16 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-medium py-4">
            <div>© 2026 OnlineURLPlayer. All rights reserved.</div>
            <div class="flex gap-4">
                <a href="#" class="hover:underline">Privacy Policy</a>
                <a href="#" class="hover:underline">Terms of Service</a>
                <a href="mailto:support@onlineurlplayer.com" class="hover:underline">Contact</a>
            </div>
        </div>
    </footer>

    <script>
        let art = null;
        const STORAGE_KEY = 'online_videoplayer_history_v1';
        // CF Workers 代理网关地址预留（后期建立反跨域技术壁垒时配置）
        const PROXY_GATEWAY = 'https://proxy.onlineurlplayer.com/?url=';

        window.onload = function() {
            refreshHistoryList();
            // 默认加载公共测试用例，让首页进场不为空白
            initializePlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
        };

        // 核心函数：根据资源类型构建/重建 ArtPlayer 实例
        function initializePlayer(targetUrl) {
            if (art) { art.destroy(); }

            // 检查用户是否开启了防跨域/反盗链代理开关
            const isProxyEnabled = document.getElementById('use-proxy').checked;
            const finalPlaybackUrl = isProxyEnabled ? `${PROXY_GATEWAY}${encodeURIComponent(targetUrl)}` : targetUrl;

            art = new Artplayer({
                container: '#player-container',
                url: finalPlaybackUrl,
                fullscreen: true,
                fullscreenWeb: true,
                playbackRate: true,
                aspectRatio: true,
                setting: true,
                pip: true,
                autoSize: true,
                theme: '#2563eb',
                // 🚀 核心看家本领：挂载自定义解码钩子拦截 M3U8 流
                customType: {
                    m3u8: function(video, url) {
                        if (Hls.isSupported()) {
                            const hls = new Hls({ maxMaxBufferLength: 30 });
                            hls.loadSource(url);
                            hls.attachMedia(video);
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = url;
                        }
                    }
                }
            });
        }

        // 按钮触发入口
        function loadVideo() {
            const urlInput = document.getElementById('video-url').value.trim();
            if (!urlInput) {
                alert('Please enter a valid video link.');
                return;
            }
            if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
                alert('URL must start with http:// or https://');
                return;
            }

            initializePlayer(urlInput);
            commitUrlToHistory(urlInput);
        }

        // LocalStorage 历史记录管道
        function commitUrlToHistory(url) {
            let list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            list = list.filter(item => item !== url); // 深度去重
            list.unshift(url); // 推入顶层
            if (list.length > 5) list.pop(); // 节制长度为5条
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            refreshHistoryList();
        }

        function refreshHistoryList() {
            const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            const box = document.getElementById('history-box');
            const container = document.getElementById('history-list');

            if (list.length === 0) {
                box.classList.add('hidden');
                return;
            }

            box.classList.remove('hidden');
            container.innerHTML = list.map(url => `
                <div onclick="playbackFromHistory('${url}')" 
                     class="text-sm text-blue-600 hover:text-blue-800 font-mono truncate cursor-pointer bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 transition-all" 
                     title="${url}">
                    ${url}
                </div>
            `).join('');
        }

        function playbackFromHistory(url) {
            document.getElementById('video-url').value = url;
            initializePlayer(url);
        }
    </script>
</body>
</html>
```

- [ ] **Step 2: 验证 HTML 结构**

在浏览器中打开 `index.html`，确认：
- 页面正常加载
- 播放器容器显示
- 布局正确

- [ ] **Step 3: 提交基础结构**

```bash
git add index.html
git commit -m "feat: 创建基础 HTML 结构与 CSS 变量定义"
```

---

## Task 2: 主题切换功能实现

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加主题切换按钮**

在导航栏中添加主题切换按钮：

```html
<div class="flex items-center gap-4 text-sm font-medium text-slate-600">
    <a href="#faq" class="hover:text-blue-600 transition-colors" data-i18n="nav_faq">FAQ</a>
    <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold" data-i18n="nav_safe">Client-Side Safe</span>
    <button id="theme-toggle" onclick="toggleTheme()" class="p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Toggle theme">
        <svg id="theme-icon-light" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
        <svg id="theme-icon-dark" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
    </button>
</div>
```

- [ ] **Step 2: 添加主题切换 JavaScript 逻辑**

在 `<script>` 标签中添加主题切换函数：

```javascript
// 主题切换逻辑
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  
  // 更新主题图标
  updateThemeIcon(next);
  
  // 更新 ArtPlayer 主题色
  if (art) {
    art.theme = next === 'dark' ? '#3b82f6' : '#2563eb';
  }
}

// 初始化主题
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

// 更新主题图标
function updateThemeIcon(theme) {
  const lightIcon = document.getElementById('theme-icon-light');
  const darkIcon = document.getElementById('theme-icon-dark');
  
  if (theme === 'dark') {
    lightIcon.classList.add('hidden');
    darkIcon.classList.remove('hidden');
  } else {
    lightIcon.classList.remove('hidden');
    darkIcon.classList.add('hidden');
  }
}

// 在 window.onload 中调用 initTheme
window.onload = function() {
  initTheme(); // 添加这行
  refreshHistoryList();
  initializePlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
};
```

- [ ] **Step 3: 测试主题切换**

在浏览器中测试：
- 点击主题切换按钮
- 验证页面颜色变化
- 刷新页面后主题保持
- 检查 localStorage 中的 theme 值

- [ ] **Step 4: 提交主题切换功能**

```bash
git add index.html
git commit -m "feat: 实现主题切换功能"
```

---

## Task 3: 多语言支持实现

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加 i18n 语言配置**

在 `<script>` 标签开头添加多语言配置：

```javascript
// 多语言配置
const i18n = {
  en: {
    // 导航栏
    nav_faq: 'FAQ',
    nav_safe: 'Client-Side Safe',
    
    // 主标题
    hero_title: 'Play Video from URL Online',
    hero_subtitle: 'Fast, free, and web-based video player from link. Perfect for testing streams and instant playback.',
    
    // 输入区域
    input_placeholder: 'Paste video URL here (e.g., https://example.com/movie.mp4 or .m3u8)',
    btn_play: 'Play Now',
    proxy_label: 'Enable Stream Proxy',
    proxy_hint: 'Check this if your link fails due to CORS or Anti-leech errors',
    
    // 历史记录
    history_title: 'Recent Links',
    
    // FAQ
    faq_title: 'Frequently Asked Questions',
    faq1_q: 'How do I use this online video player from URL?',
    faq1_a: 'Simply paste your direct video link (URL) into the input field above and click the "Play Now" button. Our player instantly detects the container format and loads your media stream within milliseconds. No registration or software downloads required.',
    faq2_q: 'Does this player support M3U8 and HLS network resources?',
    faq2_a: 'Yes, absolutely. This link player natively integrates streaming support for M3U8, HLS live broadcasts, and standard MP4/WebM resources. It serves as a professional, lightweight stream testing tool tailored for developers and video engineers globally.',
    faq3_q: 'Is it safe to paste and play private links on this website?',
    faq3_a: 'Your data privacy is completely guaranteed. This application functions 100% on the client-side. The URLs you paste are evaluated and resolved entirely inside your local browser and are never transmitted to any external backend server or database.',
    
    // 错误提示
    error_cors: 'This video link has CORS restrictions',
    error_notFound: 'Video link is not accessible',
    error_format: 'Unsupported video format',
    error_network: 'Network connection error',
    error_retry: 'Retry',
    error_proxy_hint: 'Please check "Enable Stream Proxy" and try again',
    error_url_hint: 'Please check if the link is correct',
    error_format_hint: 'Supports MP4, M3U8, WebM formats',
    error_network_hint: 'Please check your network and try again'
  },
  zh: {
    // 导航栏
    nav_faq: '常见问题',
    nav_safe: '客户端安全',
    
    // 主标题
    hero_title: '在线视频播放器',
    hero_subtitle: '快速、免费、基于网页的视频链接播放器。适合测试流媒体和即时播放。',
    
    // 输入区域
    input_placeholder: '粘贴视频链接（如 https://example.com/movie.mp4 或 .m3u8）',
    btn_play: '立即播放',
    proxy_label: '启用流代理',
    proxy_hint: '如果链接因跨域或防盗链失败，请勾选此项',
    
    // 历史记录
    history_title: '最近播放',
    
    // FAQ
    faq_title: '常见问题',
    faq1_q: '如何使用这个在线视频播放器？',
    faq1_a: '只需将视频链接粘贴到输入框中，点击"立即播放"按钮。播放器会自动检测格式并加载视频，无需注册或下载软件。',
    faq2_q: '支持 M3U8 和 HLS 流媒体吗？',
    faq2_a: '完全支持。播放器原生集成 M3U8、HLS 直播流和标准 MP4/WebM 资源的流媒体支持，是开发者和视频工程师的专业轻量级测试工具。',
    faq3_q: '在这个网站上粘贴和播放私密链接安全吗？',
    faq3_a: '您的数据隐私完全有保障。此应用 100% 在客户端运行，粘贴的链接完全在本地浏览器中解析，不会传输到任何外部服务器或数据库。',
    
    // 错误提示
    error_cors: '此视频链接存在跨域限制',
    error_notFound: '视频链接无法访问',
    error_format: '不支持的视频格式',
    error_network: '网络连接异常',
    error_retry: '重试',
    error_proxy_hint: '请勾选"启用流代理"后重试',
    error_url_hint: '请检查链接是否正确',
    error_format_hint: '支持 MP4、M3U8、WebM 格式',
    error_network_hint: '请检查网络后重试'
  }
};

// 当前语言
let currentLang = localStorage.getItem('lang') || 'en';

// 语言切换函数
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang);
  updatePageTexts();
}

// 翻译函数
function t(key) {
  return i18n[currentLang][key] || i18n['en'][key] || key;
}

// 更新页面文本
function updatePageTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
}
```

- [ ] **Step 2: 添加语言切换按钮**

在导航栏中添加语言切换按钮：

```html
<div class="flex items-center gap-4 text-sm font-medium text-slate-600">
    <a href="#faq" class="hover:text-blue-600 transition-colors" data-i18n="nav_faq">FAQ</a>
    <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold" data-i18n="nav_safe">Client-Side Safe</span>
    
    <!-- 语言切换 -->
    <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        <button onclick="setLanguage('en')" class="px-2 py-1 rounded text-xs font-medium transition-colors" id="lang-en">EN</button>
        <button onclick="setLanguage('zh')" class="px-2 py-1 rounded text-xs font-medium transition-colors" id="lang-zh">中文</button>
    </div>
    
    <button id="theme-toggle" onclick="toggleTheme()" class="p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Toggle theme">
        <!-- 主题图标 -->
    </button>
</div>
```

- [ ] **Step 3: 添加语言按钮样式**

在 `<style>` 标签中添加语言按钮样式：

```css
/* 语言切换按钮样式 */
#lang-en, #lang-zh {
  color: var(--text-secondary);
}

#lang-en:hover, #lang-zh:hover {
  color: var(--text-primary);
}

#lang-en.active, #lang-zh.active {
  background-color: var(--accent);
  color: white;
}
```

- [ ] **Step 4: 更新语言按钮状态**

在 `setLanguage` 函数中添加按钮状态更新：

```javascript
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang);
  updatePageTexts();
  updateLanguageButtons(lang);
}

function updateLanguageButtons(lang) {
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-zh').classList.toggle('active', lang === 'zh');
}
```

- [ ] **Step 5: 初始化语言**

在 `window.onload` 中添加语言初始化：

```javascript
window.onload = function() {
  initTheme();
  initLanguage(); // 添加这行
  refreshHistoryList();
  initializePlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
};

function initLanguage() {
  const saved = localStorage.getItem('lang') || 'en';
  document.documentElement.setAttribute('lang', saved);
  updateLanguageButtons(saved);
  updatePageTexts();
}
```

- [ ] **Step 6: 测试多语言切换**

在浏览器中测试：
- 点击语言切换按钮
- 验证页面文本变化
- 刷新页面后语言保持
- 检查 localStorage 中的 lang 值

- [ ] **Step 7: 提交多语言支持**

```bash
git add index.html
git commit -m "feat: 实现多语言支持"
```

---

## Task 4: 控件样式优化

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加播放器控件样式**

在 `<style>` 标签中添加播放器控件优化样式：

```css
/* 播放器控件优化 */
.art-control-progress {
  height: 20px;
  cursor: pointer;
}

.art-control-progress .art-progress-loaded {
  background: rgba(255, 255, 255, 0.3);
}

.art-control-progress .art-progress-played {
  background: var(--accent);
}

.art-control-playback {
  transition: transform 0.2s ease;
}

.art-control-playback:active {
  transform: scale(0.9);
}

.art-control-volume .art-volume-slider {
  width: 80px;
  height: 4px;
  border-radius: 2px;
}

/* 播放器主题色 */
.art-video-player {
  --art-theme: var(--accent);
}
```

- [ ] **Step 2: 更新 ArtPlayer 配置**

修改 `initializePlayer` 函数，使用主题色：

```javascript
function initializePlayer(targetUrl) {
    if (art) { art.destroy(); }

    const isProxyEnabled = document.getElementById('use-proxy').checked;
    const finalPlaybackUrl = isProxyEnabled ? `${PROXY_GATEWAY}${encodeURIComponent(targetUrl)}` : targetUrl;

    // 获取当前主题色
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeColor = currentTheme === 'dark' ? '#3b82f6' : '#2563eb';

    art = new Artplayer({
        container: '#player-container',
        url: finalPlaybackUrl,
        fullscreen: true,
        fullscreenWeb: true,
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        pip: true,
        autoSize: true,
        theme: themeColor,
        customType: {
            m3u8: function(video, url) {
                if (Hls.isSupported()) {
                    const hls = new Hls({ maxMaxBufferLength: 30 });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                }
            }
        }
    });
}
```

- [ ] **Step 3: 测试控件样式**

在浏览器中测试：
- 播放视频
- 检查进度条样式
- 检查音量控制样式
- 测试播放/暂停按钮动画

- [ ] **Step 4: 提交控件样式优化**

```bash
git add index.html
git commit -m "feat: 优化播放器控件样式"
```

---

## Task 5: 响应式适配优化

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加响应式样式**

在 `<style>` 标签中添加响应式样式：

```css
/* 响应式适配 */
@media (max-width: 767px) {
  .art-control {
    min-height: 44px;
  }
  
  .art-control-volume {
    display: none;
  }
  
  .history-item {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  /* 移动端输入区域垂直排列 */
  .input-group {
    flex-direction: column;
  }
  
  .input-group button {
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .art-control-pip {
    display: none;
  }
}

/* 播放器容器响应式 */
#player-container {
  width: 100%;
  max-width: 100%;
}

@media (min-width: 1024px) {
  #player-container {
    max-width: 900px;
    margin: 0 auto;
  }
}
```

- [ ] **Step 2: 更新输入区域 HTML**

修改输入区域，添加响应式类名：

```html
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-3 input-group">
        <input type="url" id="video-url" 
               class="flex-grow border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
               data-i18n="input_placeholder"
               placeholder="Paste video URL here (e.g., https://example.com/movie.mp4 or .m3u8)" required>
        <button onclick="loadVideo()" 
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg text-base cursor-pointer shadow-sm transition-all text-center whitespace-nowrap"
                data-i18n="btn_play">
            Play Now
        </button>
    </div>
    
    <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <input type="checkbox" id="use-proxy" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
        <label for="use-proxy" class="cursor-pointer select-none">
            <span data-i18n="proxy_label">Enable Stream Proxy</span> 
            <span class="text-slate-400" data-i18n="proxy_hint">(Check this if your link fails due to CORS or Anti-leech errors)</span>
        </label>
    </div>
</div>
```

- [ ] **Step 3: 测试响应式布局**

在浏览器中测试：
- 调整浏览器窗口大小
- 检查不同断点下的布局
- 测试移动端模拟器

- [ ] **Step 4: 提交响应式适配**

```bash
git add index.html
git commit -m "feat: 优化响应式适配"
```

---

## Task 6: 加载/缓冲状态优化

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加加载动画 HTML**

在播放器容器后添加加载动画：

```html
<div id="player-container" class="w-full rounded-xl shadow-lg overflow-hidden border border-slate-900 mb-6 aspect-video relative">
    <!-- 加载动画 -->
    <div id="loading-overlay" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p class="text-white text-sm">Loading...</p>
        </div>
    </div>
</div>
```

- [ ] **Step 2: 添加加载动画样式**

在 `<style>` 标签中添加加载动画样式：

```css
/* 加载动画 */
#loading-overlay {
  z-index: 10;
  transition: opacity 0.3s ease;
}

#loading-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 3: 添加加载状态 JavaScript**

在 `<script>` 标签中添加加载状态控制：

```javascript
// 加载状态控制
function showLoading() {
  const overlay = document.getElementById('loading-overlay');
  overlay.classList.remove('hidden');
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  overlay.classList.add('hidden');
}

// 在 initializePlayer 中添加事件监听
function initializePlayer(targetUrl) {
    if (art) { art.destroy(); }

    showLoading(); // 显示加载动画

    const isProxyEnabled = document.getElementById('use-proxy').checked;
    const finalPlaybackUrl = isProxyEnabled ? `${PROXY_GATEWAY}${encodeURIComponent(targetUrl)}` : targetUrl;

    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeColor = currentTheme === 'dark' ? '#3b82f6' : '#2563eb';

    art = new Artplayer({
        container: '#player-container',
        url: finalPlaybackUrl,
        fullscreen: true,
        fullscreenWeb: true,
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        pip: true,
        autoSize: true,
        theme: themeColor,
        customType: {
            m3u8: function(video, url) {
                if (Hls.isSupported()) {
                    const hls = new Hls({ maxMaxBufferLength: 30 });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                }
            }
        }
    });

    // 监听播放器事件
    art.on('video:waiting', () => {
        showLoading();
    });

    art.on('video:playing', () => {
        hideLoading();
    });

    art.on('video:canplay', () => {
        hideLoading();
    });

    art.on('video:error', (error) => {
        hideLoading();
        showError(error);
    });
}
```

- [ ] **Step 4: 测试加载状态**

在浏览器中测试：
- 加载视频时显示加载动画
- 视频播放后隐藏加载动画
- 网络错误时显示错误提示

- [ ] **Step 5: 提交加载状态优化**

```bash
git add index.html
git commit -m "feat: 优化加载/缓冲状态"
```

---

## Task 7: 错误处理优化

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加错误提示 HTML**

在播放器容器后添加错误提示：

```html
<div id="player-container" class="w-full rounded-xl shadow-lg overflow-hidden border border-slate-900 mb-6 aspect-video relative">
    <!-- 加载动画 -->
    <div id="loading-overlay" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p class="text-white text-sm" data-i18n="loading">Loading...</p>
        </div>
    </div>
    
    <!-- 错误提示 -->
    <div id="error-overlay" class="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center hidden">
        <div class="text-center max-w-md mx-4">
            <div class="bg-white rounded-lg p-6 shadow-xl">
                <div class="text-red-500 mb-4">
                    <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2" id="error-title">Error</h3>
                <p class="text-gray-600 mb-4" id="error-message">An error occurred</p>
                <p class="text-sm text-gray-500 mb-4" id="error-suggestion"></p>
                <button onclick="retryVideo()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors" data-i18n="error_retry">
                    Retry
                </button>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 2: 添加错误提示样式**

在 `<style>` 标签中添加错误提示样式：

```css
/* 错误提示 */
#error-overlay {
  z-index: 20;
  transition: opacity 0.3s ease;
}

#error-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}
```

- [ ] **Step 3: 添加错误处理 JavaScript**

在 `<script>` 标签中添加错误处理：

```javascript
// 错误处理
function showError(error) {
  const overlay = document.getElementById('error-overlay');
  const title = document.getElementById('error-title');
  const message = document.getElementById('error-message');
  const suggestion = document.getElementById('error-suggestion');
  
  // 根据错误类型显示不同信息
  let errorType = 'network';
  
  if (error.message && error.message.includes('CORS')) {
    errorType = 'cors';
  } else if (error.message && error.message.includes('404')) {
    errorType = 'notFound';
  } else if (error.message && error.message.includes('format')) {
    errorType = 'format';
  }
  
  const errorInfo = {
    cors: {
      title: t('error_cors'),
      message: t('error_cors'),
      suggestion: t('error_proxy_hint')
    },
    notFound: {
      title: t('error_notFound'),
      message: t('error_notFound'),
      suggestion: t('error_url_hint')
    },
    format: {
      title: t('error_format'),
      message: t('error_format'),
      suggestion: t('error_format_hint')
    },
    network: {
      title: t('error_network'),
      message: t('error_network'),
      suggestion: t('error_network_hint')
    }
  };
  
  const info = errorInfo[errorType] || errorInfo.network;
  
  title.textContent = info.title;
  message.textContent = info.message;
  suggestion.textContent = info.suggestion;
  
  overlay.classList.remove('hidden');
}

function hideError() {
  const overlay = document.getElementById('error-overlay');
  overlay.classList.add('hidden');
}

function retryVideo() {
  hideError();
  const url = document.getElementById('video-url').value.trim();
  if (url) {
    initializePlayer(url);
  }
}
```

- [ ] **Step 4: 测试错误处理**

在浏览器中测试：
- 输入无效链接
- 检查错误提示显示
- 点击重试按钮
- 测试不同错误类型

- [ ] **Step 5: 提交错误处理优化**

```bash
git add index.html
git commit -m "feat: 优化错误处理"
```

---

## Task 8: 最终测试与优化

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 完整功能测试**

在浏览器中测试所有功能：
- 主题切换
- 多语言切换
- 视频播放
- 响应式布局
- 加载状态
- 错误处理
- 历史记录

- [ ] **Step 2: 性能优化**

检查并优化：
- 减少不必要的 DOM 操作
- 优化动画性能
- 检查内存泄漏

- [ ] **Step 3: 代码清理**

清理代码：
- 移除调试代码
- 添加必要注释
- 确保代码格式一致

- [ ] **Step 4: 最终提交**

```bash
git add index.html
git commit -m "feat: 完成播放器体验优化"
```

- [ ] **Step 5: 部署准备**

确认：
- 所有功能正常
- 无 JavaScript 错误
- 响应式布局正常
- 多语言支持正常

---

## 自检清单

**1. 规范覆盖：**
- ✅ 主题切换机制 - Task 2
- ✅ 控件样式优化 - Task 4
- ✅ 响应式适配改进 - Task 5
- ✅ 加载/缓冲状态优化 - Task 6
- ✅ 错误处理与用户体验 - Task 7
- ✅ 多语言支持 - Task 3

**2. 占位符扫描：**
- ✅ 无 TBD、TODO 等占位符
- ✅ 所有步骤都有具体代码

**3. 类型一致性：**
- ✅ 函数名、变量名一致
- ✅ CSS 类名一致
- ✅ HTML 属性一致

---

## 执行选项

**计划完成并保存到 `docs/superpowers/plans/2026-06-08-player-ux-optimization.md`。两种执行方式：**

**1. Subagent-Driven（推荐）** - 我为每个任务分发新的子任务代理，任务之间进行审查，快速迭代

**2. Inline Execution** - 在当前会话中使用 executing-plans 执行任务，批量执行并设置检查点

**选择哪种方式？**
