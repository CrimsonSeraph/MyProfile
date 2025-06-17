// 当页面DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function () {
    // ====================== 平滑滚动功能 ======================
    // 选择所有以"#"开头的锚点链接
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // 为每个锚点添加点击事件监听器
        anchor.addEventListener('click', function (e) {
            // 获取链接的href属性值
            const href = this.getAttribute('href');

            // 排除特殊情况：
            // 1. 只有"#"表示返回页面顶部
            // 2. 包含".html"的链接（指向其他页面）
            if (href === '#' || href.includes('.html')) {
                return; // 不执行后续操作
            }

            // 阻止链接默认跳转行为
            e.preventDefault();

            // 获取目标元素（使用href作为选择器）
            const targetElement = document.querySelector(href);

            // 如果目标元素存在
            if (targetElement) {
                // 平滑滚动到目标位置
                window.scrollTo({
                    // 计算位置：目标元素顶部偏移减去80px（为固定导航栏留空间）
                    top: targetElement.offsetTop - 80,
                    // 启用平滑滚动效果
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================== 加载页进度条动画 ======================
    // 获取进度条元素
    const progressBar = document.querySelector('.progress-bar');

    // 检查当前是否为加载页（通过进度条是否存在判断）
    if (progressBar) {
        let progress = 0; // 初始进度值

        // 设置定时器，每200毫秒更新一次进度
        const interval = setInterval(() => {
            // 随机增加进度值（0-5之间）
            progress += Math.random() * 5;

            // 更新进度条宽度
            progressBar.style.width = `${progress}%`;

            // 检查进度是否达到或超过100%
            if (progress >= 100) {
                // 完成进度，确保显示100%
                progress = 100;
                // 清除定时器，停止进度更新
                clearInterval(interval);

                // 延迟500毫秒（让进度条保持在100%）
                setTimeout(() => {
                    // 检查是否仍在加载页
                    const isStillOnLoadingPage = window.location.pathname.endsWith('/') ||
                        window.location.pathname.endsWith('/index.html');

                    // 如果仍在加载页
                    if (isStillOnLoadingPage) {
                        // 显示错误信息
                        document.querySelector('.loading-text').innerHTML =
                            '重定向失败<br><small>正在尝试备用方案</small>';

                        // 延迟2秒后执行重定向
                        setTimeout(() => {
                            // 重定向到默认页面
                            window.location.href = 'global.html';
                        }, 2000);
                    }
                }, 500); // 500毫秒后执行
            }
        }, 200); // 每200毫秒执行一次
    }
});