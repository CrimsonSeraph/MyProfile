addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const requestPath = url.pathname;

    // 1. ����̬��Դ����
    if (requestPath.startsWith('/assets/') ||
        requestPath.startsWith('/css/') ||
        requestPath.startsWith('/js/') ||
        requestPath.startsWith('/workers-site/')) {
        return fetch(request);
    }

    // 2. �����·������
    if (requestPath === '/') {
        const country = request.headers.get('cf-ipcountry') || 'XX';
        const countryPageMap = {
            'CN': 'CN.html', 
        };

        const targetPage = countryPageMap[country] || 'Global.html'; 

        // ��ȡ����ҳ������
        const loaderResponse = await fetch('https://your-domain.com/index.html');
        let htmlContent = await loaderResponse.text();

        // �ڵ�һ��<script>��ǩǰע��Ŀ��ҳ�����
        const injectionCode = `<script>window.targetPage = "${targetPage}";</script>`;
        htmlContent = htmlContent.replace('<head>', `<head>${injectionCode}`);

        return new Response(htmlContent, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // 3. ֱ�ӷ�������HTML�ļ�����
    return fetch(request);
}