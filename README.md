# OnlineURLPlayer

免费在线视频播放器，支持从 URL 播放 MP4、WebM、M3U8/HLS 流媒体。

**在线访问：** [onlineurlplayer.com](https://onlineurlplayer.com)

## 功能

- 播放 MP4、WebM、M3U8/HLS 视频链接
- 深色/浅色主题切换
- 中英文语言切换
- CORS 代理模式（解决跨域限制）
- 播放历史记录
- 移动端响应式适配
- 100% 客户端运行，无需注册

## 技术栈

- HTML + Tailwind CSS (CDN)
- [ArtPlayer.js](https://artplayer.org/) - 视频播放器
- [Hls.js](https://github.com/video-dev/hls.js/) - HLS 流媒体支持
- Cloudflare Pages - 静态托管
- Cloudflare Workers - CORS 代理

## 部署

### 主站（Cloudflare Pages）

推送代码到 `master` 分支后自动部署。

### CORS 代理（Cloudflare Workers）

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署 Worker
wrangler deploy
```

## 本地开发

直接在浏览器中打开 `index.html` 即可，无需构建步骤。

## License

MIT
