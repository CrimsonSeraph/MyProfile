// ========== 主题管理 ==========
const theme = {
    elements: null, // 稍后初始化

    // 更新CSS背景变量
    updateBackground: function () {
        const isDark = document.body.classList.contains('dark-mode');
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
        // 初始化元素引用
        this.elements = {
            toggleBtn: document.getElementById('theme-toggle'),
            body: document.body
        };

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.elements.body.classList.add('dark-mode');
            this.elements.toggleBtn.textContent = '切换白天';
        }

        this.updateBackground();

        // 添加单次事件监听
        this.elements.toggleBtn.addEventListener('click', () => this.toggle());
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

document.addEventListener('DOMContentLoaded', function () {
    // ========== 内容切换 ==========
    const contentSystem = {
        // 初始化内容系统
        init: function () {
            this.elements = {
                contentText: document.getElementById('content-text'),
                categoryBtns: document.querySelectorAll('.toggle')
            };

            // 添加按钮点击事件
            this.elements.categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => this.switchContent(btn.dataset.target));
            });

            // 默认显示自我介绍
            this.switchContent('PerEval');

            const expandBtn = document.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const menu = e.currentTarget.closest('.expandable-menu');
                    menu.classList.toggle('expanded');
                });
            }

            // 点击子按钮时收起菜单
            document.querySelectorAll('.sub-buttons .toggle').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.closest('.expandable-menu').classList.remove('expanded');
                });
            });

            // 点击外部时收起菜单
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.expandable-menu')) {
                    document.querySelectorAll('.expandable-menu').forEach(menu => {
                        menu.classList.remove('expanded');
                    });
                }
            });
        },

        // 切换内容
        switchContent: function (targetId) {
            // 更新按钮状态
            this.elements.categoryBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.target === targetId);
            });

            // 更新内容
            const contentData = CONTENT_DATA[targetId];
            if (contentData) {
                // 处理内容中的长文本
                const processedContent = this.processContent(contentData.content);

                this.elements.contentText.innerHTML = `
                <h1>${contentData.title}</h1>
                <div class="content-body">${processedContent}</div>
            `;
            }
        },

        // 处理内容中的长文本
        processContent: function (content) {
            // 处理长URL - 添加零宽空格允许换行
            return content.replace(/(https?:\/\/[^\s]+)/g, (url) => {
                return url.split('/').join('/&#8203;');
            });
        }
    };
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
    document.getElementById('theme-toggle').addEventListener('click', () => theme.toggle());
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
    contentSystem.init();          // 初始化内容系统

    // 事件监听
    theme.elements.toggleBtn.addEventListener('click', () => theme.toggle());
    window.addEventListener('resize', () => theme.updateBackground());
});