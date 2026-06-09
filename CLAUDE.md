# OnlineURLPlayer

单文件视频播放器 (`index.html`)，部署在 Cloudflare Pages。
CORS 代理 Worker 部署在 Cloudflare Workers (`proxy-worker.js`)。

## ArtPlayer 播放器关键规则

1. **`type` 参数只用于自定义类型（m3u8），不用于标准视频格式**
   - `type: 'mp4'` 会导致 ArtPlayer 创建 `<source type="mp4">`（非法 MIME），浏览器拒绝播放
   - mp4/webm/ogg 不设 `type`，让浏览器自动检测；仅 m3u8 设 `type: 'm3u8'` 触发 `customType` 钩子
2. **`#player-container` 必须有 `aspect-video` 类**，否则容器高度塌陷为 0
3. **HLS.js 必须监听 `Hls.Events.ERROR` 并处理 `data.fatal`**，区分 NETWORK_ERROR / MEDIA_ERROR
4. **ArtPlayer `video:error` 回调的参数不是标准 Error 对象**，错误类型需用 `video.error.code` 判断（code=4 → 格式不支持，code=2 → 网络错误）
5. **不要自定义 loading overlay**，ArtPlayer 自带 loading 动画，自定义会与播放器内置动画冲突产生双重 loading

## CORS 代理

- Worker 脚本：`proxy-worker.js`（部署到 Cloudflare Workers）
- 当前网关地址：`https://onlineurlplayer.wangjing09527.workers.dev/?url=`
- 用户勾选 "Enable Stream Proxy" 时，URL 会通过此代理转发

## 部署架构

- **Cloudflare Pages**：托管 `index.html`（静态站点）
- **Cloudflare Workers**：运行 `proxy-worker.js`（CORS 代理）

## 文档

- 设计文档：`docs/superpowers/specs/2026-06-08-player-ux-optimization-design.md`
- 项目实施指南：`doc.md`（代码模板已过期，以 index.html 为准）
