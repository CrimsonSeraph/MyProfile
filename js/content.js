// ====================== 内容配置 ======================
const CONTENT_DATA = {
    "PerEval": {
        title: "自评",
        content: `
            <h2>自我评价</h2>
            <p>我是 Leo Yu，17 岁，高中生，性格内向但求真务实。</p>
            <ul>
                <li>爱好：游戏开发、哲学思考、3D 动画</li>
                <li>目标：制作宏大的原创 3D 魔法科技世界观游戏</li>
            </ul>
        `,
    },
    "AI-Eval": {
        title: "AI评价(GPT)",
        content: `
            <h2>AI 对你的评价</h2>
            <p>你逻辑清晰、思维缜密，自省意识强，但需要注意完美主义导致的行动迟缓。</p>
        `,
    },
    "SocAcct": {
        title: "社交账号",
        content: `
            <h2>社交平台</h2>
            <p>这里放置你的各类社交账号链接：</p>
        `,
    },
    "CtSch": {
        title: "目前安排",
        content: `
            <h2>当前学习计划</h2>
            <ol>
                <li>C++ 像素游戏开发（SDL2）</li>
                <li>面霜护手霜配方实验</li>
                <li>准备自建 VPN 云服务器</li>
            </ol>
        `,
    },
    "projects": {
        title: "个人项目",
        content: `
            <h2>项目一览</h2>
            <p>正在进行：</p>
            <ul>
                <li>像素游戏引擎开发</li>
                <li>3D 魔法科技世界观设计</li>
            </ul>
        `,
    }
};

// ====================== 图片路径设置 ======================
const IMAGE_PATHS = {
    // 头像图片
    avatar: "assets/avatar.png",
    /* —— 修改：全部改成绝对路径 —— */

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