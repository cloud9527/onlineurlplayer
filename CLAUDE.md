# OnlineURLPlayer

单文件视频播放器 (`index.html`)，部署在 Cloudflare Pages。

## ArtPlayer 播放器关键规则

1. **`type` 参数只用于自定义类型（m3u8），不用于标准视频格式**
   - `type: 'mp4'` 会导致 ArtPlayer 创建 `<source type="mp4">`（非法 MIME），浏览器拒绝播放
   - mp4/webm/ogg 不设 `type`，让浏览器自动检测；仅 m3u8 设 `type: 'm3u8'` 触发 `customType` 钩子
2. **`#player-container` 必须有 `aspect-video` 类**，否则容器高度塌陷为 0
3. **HLS.js 必须监听 `Hls.Events.ERROR` 并处理 `data.fatal`**，区分 NETWORK_ERROR / MEDIA_ERROR
4. **ArtPlayer `video:error` 回调的参数不是标准 Error 对象**，错误类型需用 `video.error.code` 判断（code=4 → 格式不支持，code=2 → 网络错误）
5. **loading overlay 隐藏需同时监听 `video:canplay` + `ready`**，避免事件注册过晚导致遮罩永远显示

## 文档

- 设计文档：`docs/superpowers/specs/2026-06-08-player-ux-optimization-design.md`
- 项目实施指南：`doc.md`（代码模板已过期，以 index.html 为准）
