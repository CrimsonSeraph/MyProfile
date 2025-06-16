addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    // 1. ����Ŀ����ҵ�ҳ��ӳ��
    const countryPageMap = {
        'CN': 'CN.html',      // �й�����ҳ��
    };

    // 2. Ĭ��ҳ��
    const defaultPage = 'Global.html';

    // 3. ��ȡ�û����Ҵ���
    const country = request.headers.get('cf-ipcountry') || 'XX';

    // 4. ��̬��Դֱ�ӷ���
    if (url.pathname.startsWith('/css/') ||
        url.pathname.startsWith('/js/')) {
        return fetch(request);
    }

    // 5. �����·������
    if (url.pathname === '/') {
        // ȷ��Ҫ�ض����ҳ��
        const targetPage = countryPageMap[country] || defaultPage;

        // ��ӵ�����Ϣ����Ӧͷ
        const headers = new Headers({
            'Location': `/${targetPage}`,
            'X-Debug-Country': country,
            'X-Debug-Target-Page': targetPage
        });

        // ����302�ض���
        return new Response(null, {
            status: 302,
            headers
        });
    }

    // 6. ����ҳ������ֱ�ӷ���
    return fetch(request);
}