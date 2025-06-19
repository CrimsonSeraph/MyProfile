document.addEventListener('DOMContentLoaded', function () {
    const switchBtn = document.getElementById('languageSwitch');
    let currentLang = 'en'; // Ĭ��Ӣ��

    // �л����Ժ���
    function toggleLanguage() {
        currentLang = (currentLang === 'zh') ? 'en' : 'zh';

        // �л����д��� data-lang ���Ե�Ԫ��
        document.querySelectorAll('[data-lang]').forEach(element => {
            if (element.dataset.lang === currentLang) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });

        // ���°�ť�ı�
        switchBtn.textContent = (currentLang === 'zh') ? 'English' : '\u4e2d\u6587'; //����

        // ��������ƫ�õ����ش洢
        localStorage.setItem('preferredLang', currentLang);
    }

    // ��ʼ�����ԣ���鱾�ش洢��
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && savedLang !== currentLang) {
        currentLang = savedLang;
        toggleLanguage(); // ǿ�Ƹ���һ��
    }

    // �󶨰�ť�¼�
    switchBtn.addEventListener('click', toggleLanguage);
});