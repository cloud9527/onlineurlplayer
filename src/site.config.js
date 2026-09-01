/**
 * ============================================================
 *  Site-wide Configuration
 * ============================================================
 *  ⚠️ IMPORTANT for forks: edit this file BEFORE deploying.
 *  ⚠️ 重要：Fork / 部署前请务必修改本文件中的站点配置，
 *     尤其是 gaId / adsenseId，否则统计与广告收益会计入原作者账户。
 *
 *  - Analytics / AdSense IDs are loaded dynamically from here.
 *    Leave empty ("") to disable tracking entirely.
 *  - The support email is injected into each page footer.
 *  - The proxy gateway is used to bypass CORS for protected links.
 * ============================================================
 */
window.SITE_CONFIG = {
  /* 站点主域名（仅用于 JS 内拼接）。
     注意：canonical / og:url / sitemap.xml 为保证 SEO 直出仍硬编码在
     HTML 与 sitemap 中，更换域名时请同步修改这些文件。 */
  domain: 'https://onlineurlplayer.com',

  /* 客服邮箱（各页 Footer 的 Contact 链接会自动使用此邮箱） */
  supportEmail: 'support@onlineurlplayer.com',

  /* Google Analytics 4 测量 ID（例如 G-XXXXXXXXXX），留空则不加载 */
  gaId: '',

  /* Google AdSense 发布商 ID（例如 ca-pub-XXXXXXXXXXXXXXXX），留空则不加载 */
  adsenseId: '',

  /* CORS 代理网关（Cloudflare Worker），用于播放受跨域/防盗链保护的链接 */
  proxyGateway: 'https://onlineurlplayer.wangjing09527.workers.dev/?url='
};

// ---- 按配置动态加载统计 / 广告脚本（ID 为空则什么都不加载） ----
(function () {
  var cfg = window.SITE_CONFIG || {};
  if (cfg.gaId && !window.__gaInjected) {
    window.__gaInjected = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.gaId);
  }
  if (cfg.adsenseId && !window.__adsenseInjected) {
    window.__adsenseInjected = true;
    var a = document.createElement('script');
    a.async = true;
    a.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + cfg.adsenseId;
    document.head.appendChild(a);
  }
})();
