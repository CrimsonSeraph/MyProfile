// Ƶ��
const HEART_RATE = 10.0;

// ����
const AMPLITUDE = 0.5;

// ����ˮƽ
const NOISE_LEVEL = 0;

// �����ٶ�
let waveScrollSpeed = 20;

// ��ȡCanvasԪ�غ�����
const canvas = document.getElementById('ecgCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.ecg-container');

// ����Canvas�ߴ���ƥ������
function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// ��ʼ�����ߴ�
resizeCanvas();

// ��Ӧ���ڴ�С�仯
window.addEventListener('resize', resizeCanvas);

// �ĵ�ͼ����
let dataPoints = [];
let frameCount = 0;

// �����ĵ�ͼ���岨��
function generatePulse() {
    const pulse = [];

    // P�����ķ�������
    for (let i = 0; i < 8; i++) {
        pulse.push(Math.sin(i * Math.PI / 8) * 15 * AMPLITUDE);
    }

    // PR��
    for (let i = 0; i < 5; i++) {
        pulse.push(0);
    }

    // QRS��Ⱥ�����ҳ�����
    pulse.push(-20 * AMPLITUDE);  // Q��
    pulse.push(-35 * AMPLITUDE);
    pulse.push(0);               // R�����
    pulse.push(80 * AMPLITUDE);   // R����ֵ
    pulse.push(0);               // R���յ�
    pulse.push(-30 * AMPLITUDE);  // S��
    pulse.push(-15 * AMPLITUDE);

    // ST��
    for (let i = 0; i < 8; i++) {
        pulse.push(0);
    }

    // T�������Ҹ�����
    for (let i = 0; i < 10; i++) {
        const t = i / 10;
        pulse.push(Math.sin(t * Math.PI) * 40 * AMPLITUDE);
    }

    // ����
    for (let i = 0; i < 15; i++) {
        pulse.push(0);
    }

    return pulse;
}

// ��ǰ����
let currentPulse = [];
let pulseIndex = 0;

// ���ƺ���
function draw() {

    // ��ȡ��ɫ
    const rootStyles = getComputedStyle(document.documentElement);
    const waveColor = rootStyles.getPropertyValue('--pulse-color').trim();
    const baselineColor = rootStyles.getPropertyValue('--pulse-color').trim();

    const width = canvas.width;
    const height = canvas.height;

    // ���Canvas�ߴ�
    if (width === 0 || height === 0) {
        setTimeout(resizeCanvas, 100);
        requestAnimationFrame(draw);
        return;
    }

    const centerY = height / 2;

    // �������
    ctx.clearRect(0, 0, width, height);

    // ����������
    const pulseInterval = Math.max(5, Math.floor(1000 / HEART_RATE));

    // ��������ݵ�
    if (frameCount % pulseInterval === 0) {
        // ��ʼ������
        currentPulse = generatePulse();
        pulseIndex = 0;
    }

    // ��ȡ��ǰֵ
    let value;
    if (currentPulse.length > 0 && pulseIndex < currentPulse.length) {
        value = currentPulse[pulseIndex];
        pulseIndex++;
    } else {
        // ��������
        value = (Math.random() - 0.5) * 10 * NOISE_LEVEL;
    }

    // ��ӵ����ݵ㣨ÿ��ֻ���һ���㣩
    dataPoints.push(value);

    // ȷ�����ݵ���������
    const maxPoints = width * 1.5; // ����1.5��������ȵ����ݵ�
    while (dataPoints.length > maxPoints) {
        dataPoints.shift();
    }

    // �����ĵ�ͼ
    ctx.beginPath();
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // �ؼ��޸�����ȷ�Ĺ�������
    const scrollFactor = 1 + (waveScrollSpeed * 0.1);
    const offset = width - dataPoints.length * scrollFactor;

    // ����·��
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

    // ���ƻ���
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

// ��ʼ�����ݵ�
for (let i = 0; i < canvas.width; i++) {
    dataPoints.push(0);
}

// ��ʼ����
draw();
