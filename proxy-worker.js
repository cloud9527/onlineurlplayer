// Cloudflare Workers CORS Proxy
// 部署到 Cloudflare Workers，绑定域名 proxy.onlineurlplayer.com

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing "url" parameter', { status: 400 });
    }

    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(targetUrl);
      new URL(decodedUrl);
    } catch (e) {
      return new Response('Invalid URL', { status: 400 });
    }

    const targetParsed = new URL(decodedUrl);

    try {
      const response = await fetch(decodedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Referer': targetParsed.origin + '/',
        },
      });

      const newHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
      };

      const ct = response.headers.get('Content-Type');
      if (ct) newHeaders['Content-Type'] = ct;
      const cl = response.headers.get('Content-Length');
      if (cl) newHeaders['Content-Length'] = cl;
      const cr = response.headers.get('Content-Range');
      if (cr) newHeaders['Content-Range'] = cr;

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (error) {
      return new Response(`Proxy error: ${error.message}`, { status: 502 });
    }
  },
};
