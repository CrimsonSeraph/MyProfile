addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    // 1. 定义目标国家的页面映射
    const countryPageMap = {
        'CN': 'CN.html',      // 中国访问页面
    };

    // 2. 默认页面
    const defaultPage = 'Global.html';

    // 3. 获取用户国家代码
    const country = request.headers.get('cf-ipcountry') || 'XX';

    // 4. 静态资源直接返回
    if (url.pathname.startsWith('/css/') ||
        url.pathname.startsWith('/js/')) {
        return fetch(request);
    }

    // 5. 处理根路径请求
    if (url.pathname === '/') {
        // 确定要重定向的页面
        const targetPage = countryPageMap[country] || defaultPage;

        // 添加调试信息到响应头
        const headers = new Headers({
            'Location': `/${targetPage}`,
            'X-Debug-Country': country,
            'X-Debug-Target-Page': targetPage
        });

        // 返回302重定向
        return new Response(null, {
            status: 302,
            headers
        });
    }

    // 6. 其他页面请求直接返回
    return fetch(request);
}