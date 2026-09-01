# Online URL Player 🎬

> A lightweight, fast, and privacy-first web-based media player. Play video URLs directly in your browser without any installation, plugins, or registration.

🌐 **Official Site & Live Tool:** [https://onlineurlplayer.com](https://onlineurlplayer.com)

---

## ✨ Key Features

- **Instant Playback:** Simply paste any stream or video URL and click play.
- **Privacy-First:** 100% client-side decoding. No video URLs, streaming data, or logs are stored on server.
- **Cross-Format Support:** Plays HLS (.m3u8), MP4, WebM, and DASH (.mpd) effortlessly.
- **Responsive UI:** Fully optimized for mobile, tablet, and desktop viewports.
- **CORS Proxy Mode:** Built-in Cloudflare Worker proxy to play links blocked by cross-origin / anti-leech protection.
- **i18n:** English & 中文 built-in language switcher.

## 🔗 Supported Formats & Specific Online Players

You can also use our specific format players directly:

- 📡 **[M3U8 / HLS Player Online](https://onlineurlplayer.com/m3u8-player)** - Dedicated player for HLS adaptive streaming.
- 📹 **[MP4 Player Online](https://onlineurlplayer.com/mp4-player)** - Instant MP4 link playback.
- ⚡ **[DASH Player Online](https://onlineurlplayer.com/dash-player)** - MPD manifest stream player.
- 🎞️ **[HLS Player Online](https://onlineurlplayer.com/hls-player)** - Live & on-demand HLS playback.

## 🛠️ Tech Stack & Deployment

- **Framework / Core:** Modern HTML5 & JavaScript (ArtPlayer / HLS.js / Dash.js)
- **Styling:** Tailwind CSS (precompiled static stylesheet in `assets/tailwind.css`)
- **Hosting:** Cloudflare Pages (Global Edge CDN)
- **CORS Proxy:** Cloudflare Workers (`proxy-worker.js`)

## ⚠️ Configuration Before Forking / Deploying

To prevent blind mirror sites from stealing your analytics and ad revenue, all site-wide settings are extracted into a **single config file**: [`src/site.config.js`](src/site.config.js).

**Edit it before you deploy your own fork:**

| Key | Description | Default |
|-----|-------------|---------|
| `domain` | Your site domain (used for JS URL building; canonical/og:url/sitemap stay hardcoded for SEO — update them too if you change domain) | `https://onlineurlplayer.com` |
| `supportEmail` | Support email shown in the footer "Contact" link | `support@onlineurlplayer.com` |
| `gaId` | Google Analytics 4 Measurement ID. Leave empty (`""`) to disable | `""` |
| `adsenseId` | Google AdSense publisher ID. Leave empty (`""`) to disable | `""` |
| `proxyGateway` | Your CORS proxy Worker URL | your Workers URL |

> **Note:** When `gaId` / `adsenseId` are empty, **no** tracking or ad scripts are loaded at all. The analytics / AdSense scripts are injected dynamically from this config, so a mirror that copies the repo **without your IDs** cannot collect stats or ad revenue in your name.

The footer keeps an attribution link back to the official site (`Powered by Online URL Player`), so even if someone mirrors the frontend code, it contributes a natural backlink to the original project.

## 🚀 Deployment

### Main Site (Cloudflare Pages)

1. Fork this repo.
2. Edit `src/site.config.js` with your own values.
3. Connect the repo to Cloudflare Pages (build command: none — static output; output directory: `/`).
4. Push to the `master` branch — auto-deploys.

### CORS Proxy (Cloudflare Workers)

```bash
# install wrangler
npm install -g wrangler

# login
wrangler login

# deploy the Worker
wrangler deploy
```

Then update `proxyGateway` in `src/site.config.js` with your Worker URL.

## 💻 Local Development

```bash
# serve the static folder (recommended — site.config.js needs HTTP)
npx serve .
# or just open index.html directly in a browser
```

No build step required.

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
