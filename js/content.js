// ====================== 内容配置 ======================
const CONTENT_DATA = {
    "PerEval": {
        title: "自评",
        content: `
            <h2>自我评价</h2>
        `,
    },

    "AI-Eval-1": {
        title: "",
        content: `
        `,
    },

    "AI-Eval-2": {
        title: "",
        content: `
        `,
    },

    "AI-Eval-3": {
        title: "",
        content: `
        `,
    },

    "AI-Eval-4": {
        title: "",
        content: `
        `,
    },

    "AI-Eval-5": {
        title: "",
        content: `
        `,
    },

    "AI-Eval-All": {
        title: "",
        content: `
        `,
    },

    "SocAcct": {
        title: "社交账号",
        content: `
            <h2>社交平台</h2>
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