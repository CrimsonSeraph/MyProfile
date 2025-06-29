// ========== 主题管理 ==========
const theme = {
    elements: null, // 初始化

    // 背景设置
    updateBackground: function () {
        if (this._updateTimeout) clearTimeout(this._updateTimeout);

        this._updateTimeout = setTimeout(() => {
            const isDark = document.body.classList.contains('dark-mode');
            const isMobile = window.matchMedia('(max-width: 768px)').matches;

            // 获取预览图和高清图路径
            const previewPath = isMobile
                ? (isDark ? IMAGE_PATHS.backgrounds.mobile.night.thumb : IMAGE_PATHS.backgrounds.mobile.day.thumb)
                : (isDark ? IMAGE_PATHS.backgrounds.pc.night.thumb : IMAGE_PATHS.backgrounds.pc.day.thumb);

            const fullPath = isMobile
                ? (isDark ? IMAGE_PATHS.backgrounds.mobile.night.full : IMAGE_PATHS.backgrounds.mobile.day.full)
                : (isDark ? IMAGE_PATHS.backgrounds.pc.night.full : IMAGE_PATHS.backgrounds.pc.day.full);

            // 移除旧的高清图
            document.documentElement.style.setProperty('--bg-preview', 'none');
            document.documentElement.style.setProperty('--bg-full', 'none');

            // 设置预览图
            document.documentElement.style.setProperty('--bg-preview', `url(${previewPath})`);

            // 清除旧的高清图加载器
            if (this._highResImg) {
                this._highResImg.onload = null;
                this._highResImg.onerror = null;
            }

            // 渐进加载高清图
            const highResImg = new Image();
            highResImg.src = fullPath; // 修正属性名

            highResImg.onload = () => {
                // 设置高清图并添加加载完成标志
                document.documentElement.style.setProperty('--bg-full', `url(${fullPath})`);
                document.body.classList.add('bg-loaded');
            };
        }, 150);
    },

    // 初始化主题
    init: function () {

        // 初始化元素引用
        this.elements = {
            toggleBtn: document.getElementById(
                'theme-toggle'),
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
        this.elements.toggleBtn.addEventListener('click', () => {
            e.stopPropagation();
            this.toggle()
        });

        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.updateBackground();
                }
            });
    },

    // 切换主题
    toggle: function () {
        this.elements.body.classList.toggle('dark-mode');
        const isDark = this.elements.body.classList.contains('dark-mode');

        this.elements.toggleBtn.textContent = isDark ? '切换白天' : '切换夜间';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // 重置背景加载状态
        document.body.classList.remove('bg-loaded');
        this.updateBackground();
    }
};

window.addEventListener('resize', () => theme.updateBackground());

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
                btn.addEventListener('click', () => {
                    if (btn.dataset.target) {
                        this.switchContent(btn.dataset.target); // 切换内容
                    } else {
                        this.handleFunctionality(btn); // 仅触发功能
                    }
                });
            });

            // 默认首页
            if (CONTENT_DATA && CONTENT_DATA.Homepage) {
                this.switchContent('Homepage');
            } else {
                console.error("首页内容数据未定义");
            }

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

        switchContent: function (targetId) {

            // 更新按钮激活状态
            this.elements.categoryBtns.forEach(btn => {
                if (btn.dataset.target) {
                    btn.classList.toggle('active', btn.dataset.target === targetId);
                }
            });

            // 插入 HTML 内容
            const contentData = CONTENT_DATA[targetId];
            if (contentData) {
                this.elements.contentText.innerHTML = `
                    <h1 class="neon-effect">${contentData.title}</h1>
                    <div class="content-body">${contentData.content}</div>
                `;
            } else {
                this.elements.contentText.innerHTML = `<p>内容不存在。</p>`;
            }
        },

        // 处理内容中的长文本
        processContent: function (content) {
            return content;
        },

        // 处理功能性按钮
        handleFunctionality: function (btn) {

            // 如果是切换夜间按钮，直接触发切换功能
            if (btn.id === 'theme-toggle') {
                theme.toggle();
            }
        }
    };

    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                theme.updateBackground();
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
    window.addEventListener('resize', adjustHeight);

    // ========== 图片预加载 & 渐进式替换 ==========
    function progressiveLoad(imgEl, originalSrc) {

        const THUMB_SUFFIX = '-thumb';
        function getThumbPath(original) {
            const extPos = original.lastIndexOf('.');
            return original.slice(0, extPos) + THUMB_SUFFIX + original.slice(extPos);
        }

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

    // ========== 图片预加载 ==========
    const preloader = {

        // 获取所有需要预加载的图片路径
        getAllImagePaths: function () {
            return [
                // 所有背景图
                IMAGE_PATHS.backgrounds.pc.day.full,
                IMAGE_PATHS.backgrounds.pc.night.full,
                IMAGE_PATHS.backgrounds.mobile.day.full,
                IMAGE_PATHS.backgrounds.mobile.night.full,

                IMAGE_PATHS.backgrounds.pc.day.thumb,
                IMAGE_PATHS.backgrounds.pc.night.thumb,
                IMAGE_PATHS.backgrounds.mobile.day.thumb,
                IMAGE_PATHS.backgrounds.mobile.night.thumb,

                // 头像和其他图片
                IMAGE_PATHS.avatar.full,

                IMAGE_PATHS.avatar.thumb,
            ];
        },

        // 预加载单张图片
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
        const avatarImg = document.querySelector('img.photo');
        if (avatarImg) {

            // 渐进加载
            const thumbPath = IMAGE_PATHS.avatar.thumb;
            const fullPath = IMAGE_PATHS.avatar.full;

            avatarImg.src = thumbPath;

            const fullImg = new Image();
            fullImg.src = fullPath;
            fullImg.onload = () => {
                avatarImg.src = fullPath;
                avatarImg.classList.add('loaded');
            };
        } else {
            console.error('未找到头像元素');
        }
    }

    // ========== 初始化所有功能 ==========
    theme.init();                          // 初始化主题
    setDynamicImages();                    // 设置动态图片
    preloader.preloadAll();                // 预加载图片
    contentSystem.init();                  // 初始化内容系统
});