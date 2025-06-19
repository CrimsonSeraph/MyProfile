document.addEventListener('DOMContentLoaded', function () {
    const switchBtn = document.getElementById('languageSwitch');
    let currentLang = 'en'; // 默认英文

    // 切换语言函数
    function toggleLanguage() {
        currentLang = (currentLang === 'zh') ? 'en' : 'zh';

        // 切换所有带有 data-lang 属性的元素
        document.querySelectorAll('[data-lang]').forEach(element => {
            if (element.dataset.lang === currentLang) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });

        // 更新按钮文本
        switchBtn.textContent = (currentLang === 'zh') ? 'English' : '\u4e2d\u6587'; //中文

        // 保存语言偏好到本地存储
        localStorage.setItem('preferredLang', currentLang);
    }

    // 初始化语言（检查本地存储）
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && savedLang !== currentLang) {
        currentLang = savedLang;
        toggleLanguage(); // 强制更新一次
    }

    // 绑定按钮事件
    switchBtn.addEventListener('click', toggleLanguage);
});