addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const requestPath = url.pathname;

    // 1. 处理静态资源请求
    if (requestPath.startsWith('/assets/') ||
        requestPath.startsWith('/css/') ||
        requestPath.startsWith('/js/') ||
        requestPath.startsWith('/workers-site/')) {
        return fetch(request);
    }

    // 2. 处理根路径请求
    if (requestPath === '/') {
        const country = request.headers.get('cf-ipcountry') || 'XX';
        const countryPageMap = {
            'CN': 'CN.html', 
        };

        const targetPage = countryPageMap[country] || 'Global.html'; 

        // 获取加载页面内容
        const loaderResponse = await fetch('https://your-domain.com/index.html');
        let htmlContent = await loaderResponse.text();

        // 在第一个<script>标签前注入目标页面变量
        const injectionCode = `<script>window.targetPage = "${targetPage}";</script>`;
        htmlContent = htmlContent.replace('<head>', `<head>${injectionCode}`);

        return new Response(htmlContent, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // 3. 直接返回其他HTML文件请求
    return fetch(request);
}