addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const requestPath = url.pathname;

    // 1. 处理静态资源请求（CSS/JS/资源文件等）
    if (requestPath.startsWith('/assets/') ||
        requestPath.startsWith('/css/') ||
        requestPath.startsWith('/js/') ||
        requestPath.startsWith('/workers-site/')) {
        return fetch(request);
    }

    // 2. 处理根路径路由
    if (requestPath === '/') {
        // 获取访问者国家代码（默认为XX表示未知）
        const country = request.headers.get('cf-ipcountry') || 'XX';
        
        // 国家代码与页面对应关系
        const countryPageMap = {
            'XX': 'CN.html', // 未知国家
            'CN': 'CN.html',  // 中国大陆
        };

        // 确定目标页面
        const targetPage = countryPageMap[country] || 'Global.html'; 

        // 获取基础HTML模板
        const loaderResponse = await fetch(new URL('/index.html', request.url));
        let htmlContent = await loaderResponse.text();

        // 在<head>标签后注入目标页面信息
        const injectionCode = `<script>window.targetPage = "${targetPage}";</script>`;
        htmlContent = htmlContent.replace('<head>', `<head>${injectionCode}`);

        // 返回HTML内容
        return new Response(htmlContent, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // 3. 其他情况直接返回原始请求结果
    return fetch(request);
    
}