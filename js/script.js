// ========== 主题管理 ==========
const theme = {
    elements: null, // 初始化

    // 更新CSS背景变量
    updateBackground: function () {

        // 防抖处理（150ms）
        if (this._updateTimeout) clearTimeout(this._updateTimeout);

        this._updateTimeout = setTimeout(() => {
            const isDark = document.body.classList.contains('dark-mode');
            const isMobile = window.matchMedia('(max-width: 768px)').matches;

            // 从IMAGE_PATHS选择对应路径
            const bgPath = isMobile
                ? (isDark ? IMAGE_PATHS.backgrounds.mobile.night : IMAGE_PATHS.backgrounds.mobile.day)
                : (isDark ? IMAGE_PATHS.backgrounds.pc.night : IMAGE_PATHS.backgrounds.pc.day);

            // 注入CSS变量
            document.documentElement.style.setProperty('--bg-image', `url(${bgPath})`);
        }, 150);
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

window.addEventListener('resize', () => theme.updateBackground());

document.addEventListener('DOMContentLoaded', function () {

    // ========== 内容切换 ==========
    const contentSystem = {
        element: null,

        // 初始化内容系统
        init: function () {
            this.elements = {
                contentText: document.getElementById('content-text'),
                categoryBtns: document.querySelectorAll('.toggle')
            };

            // 添加按钮点击事件
            this.elements.categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.dataset.target) {
                        this.switchContent(btn.dataset.target); // 切换内容
                    } else {
                        this.handleFunctionality(btn); // 仅触发功能
                    }
                });
            });

            // 默认显示首页
            this.switchContent('Homepage');
        },

        switchContent: function (targetId) {

            // 更新按钮激活状态
            this.elements.categoryBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.target === targetId);
            });

            // 插入 HTML 内容
            const contentData = CONTENT_DATA[targetId];
            if (contentData) {
                this.elements.contentText.innerHTML = `
                    <h1>${contentData.title}</h1>
                    <div class="content-body">${contentData.content}</div>
                `;
            } else {
                this.elements.contentText.innerHTML = `<p>内容不存在。</p>`;
            }

            // 展开父级菜单并锁定当前激活项
            expandAncestors(targetId);
        },

        // 处理功能性按钮
        handleFunctionality: function (btn) {

            // 如果是切换夜间按钮，直接触发切换功能
            if (btn.id === 'theme-toggle') {
                theme.toggle();
            }
        }
    };

    // 展开并锁定父级菜单
    function expandAncestors(targetId) {

        // 先收起所有不包含当前激活按钮的菜单
        document.querySelectorAll('.expandable-menu').forEach(menu => {
            if (!menu.querySelector(`.toggle[data-target="${targetId}"]`)) {
                menu.classList.remove('expanded');
            }
        });

        // 向上展开所有父级菜单
        const activeBtn = document.querySelector(`.toggle[data-target="${targetId}"]`);
        if (activeBtn) {
            let menu = activeBtn.closest('.expandable-menu');
            while (menu) {
                menu.classList.add('expanded');
                menu = menu.parentElement.closest('.expandable-menu');
            }
        }
    }

    // 点击菜单按钮展开/折叠
    document.querySelectorAll('.expand-btn').forEach(expandBtn => {
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = expandBtn.closest('.expandable-menu');

            // 如果当前菜单中有 active，则不可折叠
            if (!menu.querySelector('.toggle.active')) {
                menu.classList.toggle('expanded');
            }
        });
    });

    // 点击页面其他地方时，收起非激活项菜单
    document.addEventListener('click', (e) => {
        // 确保只收起同级菜单
        if (!e.target.closest('.expandable-menu')) {
            document.querySelectorAll('.expandable-menu').forEach(menu => {
                if (menu.classList.contains('expanded') && !menu.querySelector('.toggle.active')) {
                    menu.classList.remove('expanded');
                }
            });
        }
    });

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

    // ========== 图片预加载 & 渐进式替换 ==========
    function progressiveLoad(imgEl, originalSrc) {
        const thumbSrc = originalSrc.replace(/(\.\w+)$/, '-thumb$1'); /* —— 缩略图后缀模式 —— */
        imgEl.classList.add('progressive');
        imgEl.src = thumbSrc;
        const fullImg = new Image();
        fullImg.src = originalSrc;
        fullImg.onload = () => {
            imgEl.src = originalSrc;
            imgEl.classList.add('loaded');
        };
    }

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

        // 设置头像
        const avatarImg = document.querySelector('.photo[key="avatar"]');
        if (avatarImg) {
            progressiveLoad(avatarImg, IMAGE_PATHS.avatar);
        }
    }

    // ========== 初始化所有功能 ==========
    theme.init();                          // 初始化主题
    setDynamicImages();                    // 设置动态图片
    preloader.preloadAll();                // 预加载图片
    contentSystem.init();                  // 初始化内容系统
});