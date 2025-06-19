// ====================== 图片路径设置 ======================
const IMAGE_PATHS = {
    // 头像图片
    avatar: "assets/avatar.png",

    // 背景图片
    backgrounds: {
        pc: {
            day: "../assets/bg-pc-day.png",    /* 电脑白天背景 */
            night: "../assets/bg-pc-night.png"  /* 电脑夜间背景 */
        },
        mobile: {
            day: "../assets/bg-mobile-day.jpg",   /* 手机白天背景 */
            night: "../assets/bg-mobile-night.png" /* 手机夜间背景 */
        }
    },
};

document.addEventListener('DOMContentLoaded', function () {
    // ========== 平滑滚动功能 ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 排除特殊情况
            if (href === '#' || href.includes('.html')) return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== 主题管理 ==========
    const theme = {
        elements: {
            toggleBtn: document.getElementById('theme-toggle'),
            body: document.body
        },

        // 更新CSS背景变量
        updateBackground: function () {
            const isDark = this.elements.body.classList.contains('dark-mode');
            const isMobile = window.matchMedia('(max-width: 768px)').matches;

            // 从IMAGE_PATHS选择对应路径
            const bgPath = isMobile
                ? (isDark ? IMAGE_PATHS.backgrounds.mobile.night : IMAGE_PATHS.backgrounds.mobile.day)
                : (isDark ? IMAGE_PATHS.backgrounds.pc.night : IMAGE_PATHS.backgrounds.pc.day);

            // 注入CSS变量
            document.documentElement.style.setProperty('--bg-image', `url(${bgPath})`);
        },

        // 初始化主题
        init: function () {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                this.elements.body.classList.add('dark-mode');
                this.elements.toggleBtn.textContent = '切换白天';
            }

            this.updateBackground();
        },

        // 切换主题
        toggle: function () {
            this.elements.body.classList.toggle('dark-mode');
            const isDark = this.elements.body.classList.contains('dark-mode');

            this.elements.toggleBtn.textContent = isDark ? '切换白天' : '切换夜间';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.updateBackground();
        }
    };

    // 动态调整高度
    function adjustHeight() {
        const container = document.querySelector('.profile-container');
        if (window.innerWidth > 768) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const footerHeight = document.querySelector('footer')?.offsetHeight || 60;
            container.style.minHeight = `calc(100vh - ${headerHeight + footerHeight}px)`;
        }
    }

    window.addEventListener('resize', adjustHeight);
    adjustHeight(); // 初始化

    // ========== 图片预加载 ==========
    const preloader = {
        // 获取所有需要预加载的图片路径
        getAllImagePaths: function () {
            return [
                // 所有背景图
                IMAGE_PATHS.backgrounds.pc.day,
                IMAGE_PATHS.backgrounds.pc.night,
                IMAGE_PATHS.backgrounds.mobile.day,
                IMAGE_PATHS.backgrounds.mobile.night,

                // 头像和其他图片
                IMAGE_PATHS.avatar,
            ];
        },

        // 预加载单张图片（带错误处理）
        loadImage: function (src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = () => reject(`图片加载失败: ${src}`);
            });
        },

        // 批量预加载
        preloadAll: async function () {
            const images = this.getAllImagePaths();
            const loadPromises = images.map(src => this.loadImage(src).catch(console.error));

            try {
                await Promise.all(loadPromises);
                console.log('所有图片预加载完成');
            } catch (error) {
                console.warn('部分图片加载失败:', error);
            }
        }
    };

    // ========== 动态设置图片元素 ==========
    function setDynamicImages() {
        // 设置头像（示例）
        const avatarImg = document.querySelector('.photo[key="avatar"]');
        if (avatarImg) {
            avatarImg.src = IMAGE_PATHS.avatar;
        }
    }

    // ========== 初始化所有功能 ==========
    theme.init();                          // 初始化主题
    setDynamicImages();                    // 设置动态图片
    preloader.preloadAll();                // 预加载图片

    // 事件监听
    theme.elements.toggleBtn.addEventListener('click', () => theme.toggle());
    window.addEventListener('resize', () => theme.updateBackground());
});