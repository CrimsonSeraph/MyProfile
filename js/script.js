// 监听窗口大小变化事件（更新背景）
window.addEventListener('resize', () => theme.updateBackground());

// DOM加载完成后执行主逻辑
document.addEventListener('DOMContentLoaded', async function () {

    // ========== 主题管理模块 ==========
    const theme = {
        elements: null, // 用于存储DOM元素的引用
        _updateTimeout: null, // 用于背景更新函数的防抖
        _highResImg: null, // 用于存储高清背景图的Image对象

        // 更新背景图片（响应式+主题感知）
        updateBackground: function () {
            // 清除之前的防抖定时器
            if (this._updateTimeout) clearTimeout(this._updateTimeout);

            // 设置防抖延迟（150ms后执行）
            this._updateTimeout = setTimeout(() => {
                // 检测当前是否为暗黑模式
                const isDark = document.body.classList.contains('dark-mode');
                // 检测当前是否为移动设备（宽度<=768px）
                const isMobile = window.matchMedia('(max-width: 768px)').matches;

                // 根据设备和主题获取预览图路径
                const previewPath = isMobile
                    ? (isDark
                        ? IMAGE_PATHS.backgrounds.mobile.night.thumb // 移动端暗黑预览图
                        : IMAGE_PATHS.backgrounds.mobile.day.thumb)  // 移动端日间预览图
                    : (isDark
                        ? IMAGE_PATHS.backgrounds.pc.night.thumb    // PC端暗黑预览图
                        : IMAGE_PATHS.backgrounds.pc.day.thumb);   // PC端日间预览图

                // 根据设备和主题获取高清图路径
                const fullPath = isMobile
                    ? (isDark
                        ? IMAGE_PATHS.backgrounds.mobile.night.full  // 移动端暗黑高清图
                        : IMAGE_PATHS.backgrounds.mobile.day.full)   // 移动端日间高清图
                    : (isDark
                        ? IMAGE_PATHS.backgrounds.pc.night.full     // PC端暗黑高清图
                        : IMAGE_PATHS.backgrounds.pc.day.full);     // PC端日间高清图

                // 1. 清除旧的高清背景（先设置为none）
                document.documentElement.style.setProperty('--bg-full', 'none');

                // 2. 设置预览图背景
                const newPreview = `url(${previewPath})`;
                // 只有当预览图路径改变时才更新（避免不必要的重绘）
                if (document.documentElement.style.getPropertyValue('--bg-preview') !== newPreview) {
                    document.documentElement.style.setProperty('--bg-preview', newPreview);
                }

                // 3. 清除旧的高清图加载器（如果存在）
                if (this._highResImg) {
                    this._highResImg.onload = null;
                    this._highResImg.onerror = null;
                }

                // 4. 渐进式加载高清背景图
                const highResImg = new Image();
                this._highResImg = highResImg; // 存储引用以便后续清理
                highResImg.src = fullPath; // 开始加载高清图

                // 高清图加载完成后的回调
                highResImg.onload = () => {
                    // 设置CSS变量为高清图URL
                    document.documentElement.style.setProperty('--bg-full', `url(${fullPath})`);
                    // 添加加载完成标志类（用于触发过渡效果）
                    document.body.classList.add('bg-loaded');
                };
            }, 150); // 防抖延迟150毫秒
        },

        // 初始化主题系统
        init: function () {

            // 防止重复初始化
            if (this.initialized) {
                return;
            }

            // 获取DOM元素引用
            const toggleBtn = document.getElementById('theme-toggle');
            this.elements = {
                toggleBtn: toggleBtn,
                body: document.body
            };

            // 检查本地存储的主题设置
            const savedTheme = localStorage.getItem('theme');
            // 检测系统首选主题
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // 应用主题逻辑（优先级：本地存储 > 系统设置）
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                this.elements.body.classList.add('dark-mode'); // 应用暗黑模式
                this.elements.toggleBtn.textContent = '切换白天'; // 更新按钮文本
            }

            // 初始更新背景
            this.updateBackground();

            // 监听系统主题变化（仅在未设置本地主题时响应）
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                    if (!localStorage.getItem('theme')) {
                        this.updateBackground(); // 更新背景
                    }
                });
        },

        // 切换主题模式
        toggle: function () {
            // 切换暗黑模式类
            this.elements.body.classList.toggle('dark-mode');
            // 检测当前是否为暗黑模式
            const isDark = this.elements.body.classList.contains('dark-mode');

            // 更新按钮文本
            this.elements.toggleBtn.textContent = isDark ? '切换白天' : '切换夜间';
            // 保存主题设置到本地存储
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // 重置背景加载状态
            document.body.classList.remove('bg-loaded'); // 移除加载完成标志
            this.updateBackground(); // 更新背景
        }
    };

    // ========== 内容切换系统 ==========
    const contentSystem = {
        // 初始化内容系统
        init: function () {
            // 获取DOM元素引用
            this.elements = {
                contentText: document.getElementById('content-text'), // 内容显示区域
                categoryBtns: document.querySelectorAll('.toggle')    // 所有切换按钮
            };

            // 为每个按钮添加点击事件
            this.elements.categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.dataset.target) {
                        // 有目标内容的按钮：切换内容
                        this.switchContent(btn.dataset.target);
                    } else {
                        // 功能按钮：执行功能
                        this.handleFunctionality(btn);
                    }
                });
            });

            // 默认显示首页内容
            if (CONTENT_DATA && CONTENT_DATA.Homepage) {
                this.switchContent('Homepage');
            } else {
                console.error("首页内容数据未定义");
            }

            // 可展开菜单处理
            const expandBtn = document.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    const menu = e.currentTarget.closest('.expandable-menu');
                    menu.classList.toggle('expanded'); // 切换展开状态
                });
            }

            // 子菜单按钮点击后收起菜单
            document.querySelectorAll('.sub-buttons .toggle').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.closest('.expandable-menu').classList.remove('expanded');
                });
            });

            // 点击页面其他区域时收起所有菜单
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.expandable-menu')) {
                    document.querySelectorAll('.expandable-menu').forEach(menu => {
                        menu.classList.remove('expanded');
                    });
                }
            });
        },

        // 切换内容显示
        switchContent: function (targetId) {
            // 更新按钮激活状态
            this.elements.categoryBtns.forEach(btn => {
                if (btn.dataset.target) {
                    // 当前按钮匹配目标时添加active类，否则移除
                    btn.classList.toggle('active', btn.dataset.target === targetId);
                }
            });

            // 获取并显示内容
            const contentData = CONTENT_DATA[targetId];
            if (contentData) {
                // 构建内容HTML结构
                this.elements.contentText.innerHTML = `
                    <h1 class="neon-effect">${contentData.title}</h1>
                    <div class="content-body">${contentData.content}</div>
                `;
            } else {
                // 内容不存在时显示错误信息
                this.elements.contentText.innerHTML = `<p>内容不存在。</p>`;
            }
        },

        // 处理内容中的长文本（当前为空实现，预留扩展点）
        processContent: function (content) {
            return content;
        },

        // 处理功能按钮
        handleFunctionality: function (btn) {
            // 主题切换按钮的特殊处理
            if (btn.id === 'theme-toggle') {
                theme.toggle(); // 调用主题切换
            }
        }
    };

    // 监听系统主题变化（用于无本地设置时更新背景）
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
            // 排除特殊情况（空锚点或外部链接）
            if (href === '#' || href.includes('.html')) return;

            e.preventDefault(); // 阻止默认跳转行为

            const target = document.querySelector(href);
            if (target) {
                // 平滑滚动到目标位置（考虑导航栏高度）
                window.scrollTo({
                    top: target.offsetTop - 80, // 减去80px的偏移（导航栏高度）
                    behavior: 'smooth' // 平滑滚动
                });
            }
        });
    });

    // 动态调整容器高度（响应式）
    function adjustHeight() {
        const container = document.querySelector('.profile-container');
        // 仅在桌面端调整高度
        if (window.innerWidth > 768) {
            // 获取页眉页脚高度（默认值备用）
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const footerHeight = document.querySelector('footer')?.offsetHeight || 60;
            // 设置最小高度 = 视口高度 - (页眉+页脚)
            container.style.minHeight = `calc(100vh - ${headerHeight + footerHeight}px)`;
        }
    }
    // 适配旧浏览器
    function setRealVh() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--real-vh', `${vh}px`);
    }
    setRealVh();
    window.addEventListener('resize', setRealVh);

    // 监听窗口大小变化（调整高度）
    window.addEventListener('resize', adjustHeight);

    // ========== 图片预加载 & 渐进式替换 ==========
    function progressiveLoad(imgEl, originalSrc) {
        // 定义缩略图后缀
        const THUMB_SUFFIX = '-thumb';

        // 生成缩略图路径（在文件名后添加后缀）
        function getThumbPath(original) {
            const extPos = original.lastIndexOf('.');
            return original.slice(0, extPos) + THUMB_SUFFIX + original.slice(extPos);
        }

        // 获取缩略图路径
        const thumbSrc = getThumbPath(originalSrc);

        // 添加渐进加载标识类
        imgEl.classList.add('progressive');
        // 先加载缩略图
        imgEl.src = thumbSrc;

        // 后台加载高清图
        const fullImg = new Image();
        fullImg.src = originalSrc;

        // 高清图加载完成后替换
        fullImg.onload = () => {
            imgEl.src = originalSrc;
            imgEl.classList.add('loaded'); // 添加加载完成类
        };
    }

    // 初始高度调整
    adjustHeight();

    // ========== 图片预加载系统 ==========
    const preloader = {
        // 获取所有需要预加载的图片路径
        getAllImagePaths: function () {
            return [
                // 背景图（PC端）
                IMAGE_PATHS.backgrounds.pc.day.full,
                IMAGE_PATHS.backgrounds.pc.night.full,
                // 背景图（移动端）
                IMAGE_PATHS.backgrounds.mobile.day.full,
                IMAGE_PATHS.backgrounds.mobile.night.full,

                // 背景缩略图（PC端）
                IMAGE_PATHS.backgrounds.pc.day.thumb,
                IMAGE_PATHS.backgrounds.pc.night.thumb,
                // 背景缩略图（移动端）
                IMAGE_PATHS.backgrounds.mobile.day.thumb,
                IMAGE_PATHS.backgrounds.mobile.night.thumb,

                // 头像图
                IMAGE_PATHS.avatar.full,
                IMAGE_PATHS.avatar.thumb
            ];
        },

        // 预加载单张图片
        loadImage: function (src) {
            return new Promise((resolve) => {
                const img = new Image();
                // 缩略图优先加载（优化性能）
                if (src.includes('thumb')) img.fetchPriority = 'high';
                img.src = src;
                img.onload = resolve; // 加载完成时resolve
            });
        },

        // 批量预加载所有图片
        preloadAll: async function () {
            const images = this.getAllImagePaths();
            // 创建所有图片的加载Promise
            const loadPromises = images.map(src =>
                this.loadImage(src).catch(console.error)
            );

            try {
                // 并行加载所有图片
                await Promise.all(loadPromises);
                console.log('所有图片预加载完成');
            } catch (error) {
                console.warn('部分图片加载失败:', error);
            }
        }
    };

    // ========== 动态设置图片元素（渐进加载） ==========
    function setDynamicImages() {
        const avatarImg = document.querySelector('img.photo');
        if (avatarImg) {
            // 获取头像缩略图和高清图路径
            const thumbPath = IMAGE_PATHS.avatar.thumb;
            const fullPath = IMAGE_PATHS.avatar.full;

            // 先显示缩略图
            avatarImg.src = thumbPath;

            // 后台加载高清头像
            const fullImg = new Image();
            fullImg.src = fullPath;
            fullImg.onload = () => {
                // 高清图加载完成后替换
                avatarImg.src = fullPath;
                avatarImg.classList.add('loaded'); // 添加加载完成类
            };
        } else {
            console.error('未找到头像元素');
        }
    }

    // ========== 初始化所有功能 ==========
    await preloader.preloadAll();    // 等待所有图片预加载完成
    setDynamicImages();              // 设置头像（渐进加载）
    theme.init();                    // 初始化主题系统
    contentSystem.init();            // 初始化内容系统

    // 添加资源加载完成标志（可用于触发动画等）
    document.body.classList.add('resources-loaded');
});