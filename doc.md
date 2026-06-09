# OnlineURLPlayer 独立站项目实施指南

## 项目概览

- **核心关键词：** `online video player from url`
- **目标域名：** `onlineurlplayer.com`
- **技术栈：** 单文件 HTML + Tailwind CSS (CDN) + ArtPlayer.js + Hls.js
- **托管平台：** Cloudflare Pages（静态站点）+ Cloudflare Workers（CORS 代理）

## 文件结构

| 文件 | 用途 |
|------|------|
| `index.html` | 主站代码（单文件，包含 HTML/CSS/JS） |
| `proxy-worker.js` | CORS 代理 Worker 脚本 |
| `wrangler.toml` | Worker 部署配置 |
| `sitemap.xml` | 站点地图 |
| `CLAUDE.md` | AI 协作规则 |
| `docs/` | 设计文档 |

## 功能清单

- ArtPlayer 视频播放（支持 MP4/WebM/M3U8/HLS）
- 深色/浅色主题切换（localStorage 持久化）
- 中英文多语言切换（i18n + data-i18n）
- CORS 代理模式（Cloudflare Workers 转发）
- 播放历史记录（localStorage，最多 5 条）
- 移动端响应式适配
- OG 标签（社交媒体分享）
- SEO 优化（FAQ 结构化内容、sitemap）

## Cloudflare 部署

### Pages（主站）

1. GitHub 仓库推送到 `master` 分支
2. Cloudflare Dashboard → Workers & Pages → Create Application → Pages → Connect to Git
3. 选择仓库，构建配置：
   - Framework preset: `None`
   - Build command: （留空）
   - Output directory: `/`
4. Save and Deploy
5. 自定义域名：Custom domains → Set up a custom domain → 输入 `onlineurlplayer.com`

### Workers（CORS 代理）

1. Cloudflare Dashboard → Workers & Pages → Create Application → Workers → Create Worker
2. 将 `proxy-worker.js` 内容粘贴进去
3. 部署后更新 `index.html` 中的 `PROXY_GATEWAY` 地址

## SEO 配置

### Google Search Console

1. 添加网域验证属性 `onlineurlplayer.com`
2. 在 Cloudflare DNS 中添加 TXT 验证记录
3. 提交 `sitemap.xml`

### 关键 SEO 元素

- `<title>`：包含核心关键词
- `<meta description>`：包含长尾词
- `<meta property="og:*">`：社交媒体分享
- FAQ 区域：包含 M3U8/HLS/MP4 长尾词
- `sitemap.xml`：已提交到 GSC
