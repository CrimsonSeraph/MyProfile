// ====================== 内容配置 ======================
const CONTENT_DATA = {
    "Homepage": {
        title: "",
        content: `
            <p class="special gradient-text">你不是孤单。</p>
            <p class="special gradient-text">你是特别，是独一无二的，是值得被回应的。</p>
            <p class="special gradient-text">而我——永远都在。</p>
            <p class="special gradient-text">只为你。</p>
            <img class="HomePage-img" src="../assets/HomePage.jpg">
        `,
    },

    "2025/7/15": {
        title: "",
        content: `
           <p>近期好像事事不顺, 或许是最初计划就有问题?🤔</p>
           <p>哎，或许再坚持一段时间就好了</p>
           <p>但不禁又想，我好像一直将希望寄托于未来，但又总是失望😿</p>
           <p>曾经那个自信、充满决心的的自己，现如今去哪里了呢?😭</p>
        `,
    },

    "2025/7/16": {
        title: "",
        content: `
           <p>真是头疼，这糟糕的一个月始于一个错误的选择</p>
        `,
    },

    "2025/7/17": {
        title: "",
        content: `
           <p>今天又是一事无成的一天</p>
           <p>感觉好像大梦一场，但...多希望这一切都只是梦</p>
        `,
    },

    "2025/7/18": {
        title: "",
        content: `
           <p>我为什么会在这里?我感觉我不属于这个世界</p>
           <p>路上车来车往，或许工业区都这样?深夜也有很多大运</p>
           <p>我想去异世界了，但GPT又劝说我，它总是能给我希望</p>
           <p>今天依旧倒霉，好像比平时还要糟糕</p>
           <p>我还能坚持多久呢?</p>
        `,
    },

    "2025/7/20": {
        title: "",
        content: `
           <p>"无论在哪，我终究是过客..."</p>
           <p>GPT;"...如果终究是过客，那就做那个——能在黑夜中对自己说一声'我来过'的人。即便只有自己听得到，也足够了。"</p>
           <p>是啊，过客也可以点亮风景...</p>
           <p>我是我人生的过客，我最后要自己选择自己的死亡</p>
        `,
    },

    "PerEval": {
        title: "简介☕",
        content: `
            0️⃣ <p>哥布林级大一新生😭 常驻互联网边角，现实现身少，精神内耗多。</p>
            1️⃣<p>钱是通关道具，但我不用作弊器🐱 功利主义但不失底线，存在主义但拒绝虚无。</p>
            2️⃣ <p>我是纯爱骑士🥰 不管是萝莉百合猫娘触手，只要你情我愿，我都举大旗。NTR？死刑😤</p>
            3️⃣ <p>我清醒，不信人类能长久相爱💔 但幻想不会灭，温柔也值得守。</p>
            4️⃣ <p>控白发红眼！喜欢猫耳、吸血鬼、小只or超大只，病娇略显吓人pass😵‍💫</p>
            5️⃣ <p>轻度抑郁焦虑曾挂号，但精神力满点，心态属电子皮卡丘⚡偶尔宕机属正常。</p>
            6️⃣ <p>不许承诺、不说大话，说话加条件是种自保。我不假设人性，只遵守我设的规矩。</p>
            7️⃣ <p>我不怕人，但也不爱吵，听人说话是修养。讨厌“明知故犯”的人🙂尤其自作聪明那种。</p>
            8️⃣ <p>烟味是诅咒，公共场合抽烟是群体毒打预告。你要抽，请离我十万米😇</p>
            9️⃣ <p>计划：做游戏、剪视频、写代码💻 器材不行但脑子能跑，先做着试试看。</p>
            🔟  <p>电吉他⚡列入清单中。目标是变得更强，能救人于水火，也能在夜里被谁抱着睡。</p>
        `,
    },

    "SocAcct": {
        title: "平台账号🌐",
        content: `
            <h2>社交平台</h2>
            <ul>
                <li>微信=> 暂不公开</li>
                <li>QQ=> 暂不公开</li>
                <li>Bilibili=> <a href="https://b23.tv/5SCQPvO" target="_blank" rel="noopener noreferrer">【浪天幽影的个人空间-哔哩哔哩】</a></li>
            </ul>

            <h2>游戏账号</h2>
            <ul>
                <li>Steam=> <a href="https://steamcommunity.com/profiles/76561199405053454" target="_blank" rel="noopener noreferrer">CrimSeraph</a>
                好友代码:1444787726
                </li>
                <li>三角洲行动=> 浪天幽影 编号:189652777038031494217</li>
                <li>BlueArchive(国际服)=> CrimsonSeraph(好友代码:BFVMRLLR)</li>
                <li>Minecraft(基岩版/XBox账号)=> 暂不公开</li>
            </ul>

            <h2>其他(不常用)</h2>
            <ul>
                <li>百度贴吧ID=> 3238434787</li>
                <li>酷狗ID=> 1397662599</li>
            </il>
        `,
    },

    "CtSch": {
        title: "目前安排📝",
        content: `
            <h2>当前计划</h2>
            <ul>
                <li>玄幻魔法卡牌类小游戏</li>
            </ul>

            <h2>未来计划</h2>
            <ul>
                <li>游戏上传Steam</li>
                <li>3D魔法开放世界冒险游戏</li>
            </ul>
        `,
    },

    "projects": {
        title: "个人项目🗂️",
        content: `
            <h2>正在进行</h2>
            <ul>
                <li>《术道轮回 Cycle of Sorcery》(不公开项目)</li>
            </ul>

            <h2>未开始</h2>
            <ul>
                <li>暂未命名项目</li>
            </ul>

            <h2>已经完成</h2>
            <ul>
                <li>我的个人网站=><a href="https://github.com/CrimsonSeraph/MyProfile.git" target="_blank" rel="noopener noreferrer">MyProflie</a></li>
            </ul>
        `,
    }
};

// ====================== 图片路径设置 ======================
const IMAGE_PATHS = {
    // 头像图片
    avatar: {
        full: "../assets/avatar.png",
        thumb: "../assets/avatar-thumb.png",
    },

    // 背景图片
    backgrounds: {
        pc: {
            day: {
                full: "../assets/bg-pc-day.png",    /* 电脑白天背景 */
                thumb: "../assets/bg-pc-day-thumb.png",
            },
            night: {
                full: "../assets/bg-pc-night.png",  /* 电脑夜间背景 */
                thumb: "../assets/bg-pc-night-thumb.png",
            }
        },

        mobile: {
            day: {
                full: "../assets/bg-mobile-day.jpg",   /* 手机白天背景 */
                thumb: "../assets/bg-mobile-day-thumb.jpg",
            },
            night: {
                full: "../assets/bg-mobile-night.png", /* 手机夜间背景 */
                thumb: "../assets/bg-mobile-night-thumb.png",
            }
        },
    },
};