// Cloudflare Workers CORS Proxy
// 部署到 Cloudflare Workers，绑定域名 proxy.onlineurlplayer.com

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing "url" parameter', { status: 400 });
    }

    // 验证 URL 格式
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(targetUrl);
      new URL(decodedUrl);
    } catch (e) {
      return new Response('Invalid URL', { status: 400 });
    }

    // 白名单：只允许视频流媒体域名（可选安全措施）
    // const allowedDomains = ['cdn.enetres.net', 'example.com'];
    // const hostname = new URL(decodedUrl).hostname;
    // if (!allowedDomains.some(d => hostname.endsWith(d))) {
    //   return new Response('Domain not allowed', { status: 403 });
    // }

    try {
      const response = await fetch(decodedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': '*/*',
          'Origin': request.headers.get('Origin') || '',
        },
      });

      // 创建新的响应，添加 CORS 头
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
          'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
          'Cache-Control': 'no-cache',
        },
      });

      return newResponse;
    } catch (error) {
      return new Response(`Proxy error: ${error.message}`, { status: 502 });
    }
  },
};
