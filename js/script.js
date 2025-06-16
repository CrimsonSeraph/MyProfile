// ��ҳ��DOM��ȫ���غ�ִ��
document.addEventListener('DOMContentLoaded', function () {
    // ====================== ƽ���������� ======================
    // ѡ��������"#"��ͷ��ê������
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Ϊÿ��ê��������ӵ���¼�������
        anchor.addEventListener('click', function (e) {
            // ��ȡ���ӵ�href����
            const href = this.getAttribute('href');

            // �ų����������
            // 1. ������"#"��ָ��ҳ�涥����
            // 2. ����".html"�����ӣ�ָ������ҳ�棩
            if (href === '#' || href.includes('.html')) {
                return; // ��ִ�к�������
            }

            // ��ֹ���ӵ�Ĭ����ת��Ϊ
            e.preventDefault();

            // ��ȡĿ��Ԫ�أ�ʹ��href��Ϊѡ������
            const targetElement = document.querySelector(href);

            // ���Ŀ��Ԫ�ش���
            if (targetElement) {
                // ƽ��������Ŀ��λ��
                window.scrollTo({
                    // ����λ�ã�Ŀ��Ԫ�ض���ƫ�Ƽ�ȥ80px��Ϊ���������ռ䣩
                    top: targetElement.offsetTop - 80,
                    // ����ƽ������Ч��
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================== ����ҳ����������� ======================
    // ��ȡ������Ԫ��
    const progressBar = document.querySelector('.progress-bar');

    // ��鵱ǰ�Ƿ�Ϊ����ҳ�棨���������ڣ�
    if (progressBar) {
        let progress = 0; // ��ʼ����ֵ

        // ���ö�ʱ����ÿ200�������һ�ν���
        const interval = setInterval(() => {
            // ������ӽ���ֵ��0-5֮�䣩
            progress += Math.random() * 5;

            // ���½��������
            progressBar.style.width = `${progress}%`;

            // �������Ƿ�ﵽ�򳬹�100%
            if (progress >= 100) {
                // ��ɽ��ȣ�����Ϊ100%��
                progress = 100;
                // �����ʱ����ֹͣ���ȸ���
                clearInterval(interval);

                // ���500�����ӳ٣����û�����100%����
                setTimeout(() => {
                    // ����Ƿ��Ѿ��ɹ��ض���
                    const isStillOnLoadingPage = window.location.pathname.endsWith('/') ||
                        window.location.pathname.endsWith('/index.html');

                    // ������ڼ���ҳ�棨˵��Cloudflare Worker�ض���δ��Ч��
                    if (isStillOnLoadingPage) {
                        // ��ʾ������Ϣ
                        document.querySelector('.loading-text').innerHTML =
                            '�ض���ʧ��<br><small>���ڳ��Ա��÷���</small>';

                        // �ӳ�2����Ժ��ض���
                        setTimeout(() => {
                            // �ض���Ĭ��ҳ��
                            window.location.href = 'global.html';
                        }, 2000);
                    }
                }, 500); // 500�����ִ��
            }
        }, 200); // ÿ200����ִ��һ��
    }
});