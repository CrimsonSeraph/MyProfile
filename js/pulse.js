// 频率
const HEART_RATE = 10.0;

// 波幅
const AMPLITUDE = 0.5;

// 噪声水平
const NOISE_LEVEL = 0;

// 滚动速度
let waveScrollSpeed = 20;

// 获取Canvas元素和容器
const canvas = document.getElementById('ecgCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.ecg-container');

// 调整Canvas尺寸以匹配容器
function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// 初始调整尺寸
resizeCanvas();

// 响应窗口大小变化
window.addEventListener('resize', resizeCanvas);

// 心电图数据
let dataPoints = [];
let frameCount = 0;

// 生成心电图脉冲波形
function generatePulse() {
    const pulse = [];

    // P波（心房除极）
    for (let i = 0; i < 8; i++) {
        pulse.push(Math.sin(i * Math.PI / 8) * 15 * AMPLITUDE);
    }

    // PR段
    for (let i = 0; i < 5; i++) {
        pulse.push(0);
    }

    // QRS波群（心室除极）
    pulse.push(-20 * AMPLITUDE);  // Q波
    pulse.push(-35 * AMPLITUDE);
    pulse.push(0);               // R波起点
    pulse.push(80 * AMPLITUDE);   // R波峰值
    pulse.push(0);               // R波终点
    pulse.push(-30 * AMPLITUDE);  // S波
    pulse.push(-15 * AMPLITUDE);

    // ST段
    for (let i = 0; i < 8; i++) {
        pulse.push(0);
    }

    // T波（心室复极）
    for (let i = 0; i < 10; i++) {
        const t = i / 10;
        pulse.push(Math.sin(t * Math.PI) * 40 * AMPLITUDE);
    }

    // 基线
    for (let i = 0; i < 15; i++) {
        pulse.push(0);
    }

    return pulse;
}

// 当前脉冲
let currentPulse = [];
let pulseIndex = 0;

// 绘制函数
function draw() {

    // 获取颜色
    const rootStyles = getComputedStyle(document.documentElement);
    const waveColor = rootStyles.getPropertyValue('--pulse-color').trim();
    const baselineColor = rootStyles.getPropertyValue('--pulse-color').trim();

    const width = canvas.width;
    const height = canvas.height;

    // 检查Canvas尺寸
    if (width === 0 || height === 0) {
        setTimeout(resizeCanvas, 100);
        requestAnimationFrame(draw);
        return;
    }

    const centerY = height / 2;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 计算脉冲间隔
    const pulseInterval = Math.max(5, Math.floor(1000 / HEART_RATE));

    // 添加新数据点
    if (frameCount % pulseInterval === 0) {
        // 开始新脉冲
        currentPulse = generatePulse();
        pulseIndex = 0;
    }

    // 获取当前值
    let value;
    if (currentPulse.length > 0 && pulseIndex < currentPulse.length) {
        value = currentPulse[pulseIndex];
        pulseIndex++;
    } else {
        // 基线噪声
        value = (Math.random() - 0.5) * 10 * NOISE_LEVEL;
    }

    // 添加到数据点（每次只添加一个点）
    dataPoints.push(value);

    // 确保数据点数量合理
    const maxPoints = width * 1.5; // 保留1.5倍画布宽度的数据点
    while (dataPoints.length > maxPoints) {
        dataPoints.shift();
    }

    // 绘制心电图
    ctx.beginPath();
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 关键修复：正确的滚动计算
    const scrollFactor = 1 + (waveScrollSpeed * 0.1);
    const offset = width - dataPoints.length * scrollFactor;

    // 绘制路径
    for (let i = 0; i < dataPoints.length; i++) {
        const x = offset + i * scrollFactor;
        const y = centerY - dataPoints[i];

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    // 绘制基线
    ctx.beginPath();
    ctx.strokeStyle = baselineColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    frameCount++;
    requestAnimationFrame(draw);
}

// 初始化数据点
for (let i = 0; i < canvas.width; i++) {
    dataPoints.push(0);
}

// 开始动画
draw();
