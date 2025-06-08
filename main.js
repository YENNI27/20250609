const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startText = document.getElementById('startText');

let balloons = [];
let score = 0;
let gameStarted = false;
let gameEnded = false;
let lastBalloonTime = 0;

const correctAnswers = [
  "程式設計", "教育心理", "影片剪輯", "音訊錄製",
  "教學原理", "攝影技巧", "2D動畫製作", "AI使用"
];
const allAnswers = [
  ...correctAnswers, "地理環境", "我好可愛"
];

// 文字對應動物
const animalMap = {
  "程式設計": "rabbit",
  "教育心理": "cat",
  "影片剪輯": "dog",
  "音訊錄製": "bear",
  "教學原理": "pig",
  "攝影技巧": "frog",
  "2D動畫製作": "lion",
  "AI使用": "monkey",
  "地理環境": "owl",
  "我好可愛": "penguin"
};

// 動物顏色
const animalColors = {
  rabbit: "#fff0f6",
  cat: "#ffe4b5",
  dog: "#d0e6a5",
  bear: "#c2b280",
  pig: "#ffb6c1",
  frog: "#b6e388",
  lion: "#ffe066",
  monkey: "#c68642",
  owl: "#b0a18e",
  penguin: "#b0e0e6"
};

const balloonRadius = 50;
const bombRadius = 40;

// 氣球物件：{x, y, radius, text, isBomb, speed}
function spawnBalloonOrBomb() {
  const rand = Math.random();
  if (rand < 0.15) {
    const x = Math.random() * (canvas.width - bombRadius * 2) + bombRadius;
    balloons.push({
      x,
      y: -60,
      radius: bombRadius,
      text: "😄",
      isBomb: true,
      speed: 1 + Math.random() * 2,
      shake: 0,
      shakeTime: 0,
      t: Math.random() * 1000 // for animation
    });
  } else {
    const text = allAnswers[Math.floor(Math.random() * allAnswers.length)];
    const x = Math.random() * (canvas.width - balloonRadius * 2) + balloonRadius;
    balloons.push({
      x,
      y: -60,
      radius: balloonRadius,
      text,
      isBomb: false,
      speed: 1 + Math.random() * 2,
      shake: 0,
      shakeTime: 0,
      t: Math.random() * 1000 // for animation
    });
  }
}

function drawBalloons() {
  balloons.forEach(balloon => {
    // 掉落動畫：左右搖擺
    balloon.t += 0.04;
    let swing = Math.sin(balloon.t) * 10;

    // 抖動動畫
    let shakeX = 0;
    if (balloon.shakeTime > 0) {
      shakeX = Math.random() * 16 - 8;
      balloon.shakeTime--;
    }

    let drawX = balloon.x + swing + shakeX;
    let drawY = balloon.y;

    if (balloon.isBomb) {
      drawBomb(drawX, drawY, balloon.radius);
    } else {
      const animal = animalMap[balloon.text] || "fox";
      drawAnimalBalloon(drawX, drawY, balloon.radius, animal, balloon.text);
    }
    balloon.y += balloon.speed;
  });
  // 移除已經超出底部的
  balloons = balloons.filter(b => b.y < canvas.height + 60);
}

// 動物氣球繪製
function drawAnimalBalloon(x, y, r, animal, label) {
  ctx.save();
  ctx.translate(x, y);

  // 主圓形
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 2 * Math.PI);
  ctx.fillStyle = animalColors[animal] || "#ffe4e1";
  ctx.fill();
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 3;
  ctx.stroke();

  // 動物臉部特徵
  switch (animal) {
    case "rabbit":
      // 耳朵
      ctx.beginPath();
      ctx.ellipse(-r * 0.4, -r * 1.1, r * 0.22, r * 0.5, 0, 0, 2 * Math.PI);
      ctx.ellipse(r * 0.4, -r * 1.1, r * 0.22, r * 0.5, 0, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.stroke();
      break;
    case "cat":
      // 耳朵
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.7);
      ctx.lineTo(-r * 0.3, -r * 1.1);
      ctx.lineTo(-r * 0.1, -r * 0.7);
      ctx.closePath();
      ctx.moveTo(r * 0.6, -r * 0.7);
      ctx.lineTo(r * 0.3, -r * 1.1);
      ctx.lineTo(r * 0.1, -r * 0.7);
      ctx.closePath();
      ctx.fillStyle = "#ffe4b5";
      ctx.fill();
      ctx.stroke();
      break;
    case "dog":
      // 耳朵
      ctx.beginPath();
      ctx.ellipse(-r * 0.7, -r * 0.3, r * 0.18, r * 0.35, Math.PI / 6, 0, 2 * Math.PI);
      ctx.ellipse(r * 0.7, -r * 0.3, r * 0.18, r * 0.35, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#b0a18e";
      ctx.fill();
      ctx.stroke();
      break;
    case "bear":
      // 耳朵
      ctx.beginPath();
      ctx.arc(-r * 0.5, -r * 0.7, r * 0.22, 0, 2 * Math.PI);
      ctx.arc(r * 0.5, -r * 0.7, r * 0.22, 0, 2 * Math.PI);
      ctx.fillStyle = "#c2b280";
      ctx.fill();
      ctx.stroke();
      break;
    case "pig":
      // 耳朵
      ctx.beginPath();
      ctx.arc(-r * 0.5, -r * 0.8, r * 0.18, 0, 2 * Math.PI);
      ctx.arc(r * 0.5, -r * 0.8, r * 0.18, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffb6c1";
      ctx.fill();
      ctx.stroke();
      break;
    case "frog":
      // 眼睛
      ctx.beginPath();
      ctx.arc(-r * 0.4, -r * 0.8, r * 0.18, 0, 2 * Math.PI);
      ctx.arc(r * 0.4, -r * 0.8, r * 0.18, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-r * 0.4, -r * 0.8, r * 0.08, 0, 2 * Math.PI);
      ctx.arc(r * 0.4, -r * 0.8, r * 0.08, 0, 2 * Math.PI);
      ctx.fillStyle = "#222";
      ctx.fill();
      break;
    case "lion":
      // 鬃毛
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * r * 1.1, Math.sin(angle) * r * 1.1, r * 0.22, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffcc66";
        ctx.fill();
        ctx.stroke();
      }
      break;
    case "monkey":
      // 耳朵
      ctx.beginPath();
      ctx.arc(-r * 0.7, -r * 0.2, r * 0.18, 0, 2 * Math.PI);
      ctx.arc(r * 0.7, -r * 0.2, r * 0.18, 0, 2 * Math.PI);
      ctx.fillStyle = "#c68642";
      ctx.fill();
      ctx.stroke();
      break;
    case "owl":
      // 耳朵
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.8);
      ctx.lineTo(-r * 0.7, -r * 1.1);
      ctx.lineTo(-r * 0.3, -r * 0.9);
      ctx.closePath();
      ctx.moveTo(r * 0.5, -r * 0.8);
      ctx.lineTo(r * 0.7, -r * 1.1);
      ctx.lineTo(r * 0.3, -r * 0.9);
      ctx.closePath();
      ctx.fillStyle = "#b0a18e";
      ctx.fill();
      ctx.stroke();
      break;
    case "penguin":
      // 翅膀
      ctx.beginPath();
      ctx.ellipse(-r * 0.7, r * 0.2, r * 0.18, r * 0.35, Math.PI / 6, 0, 2 * Math.PI);
      ctx.ellipse(r * 0.7, r * 0.2, r * 0.18, r * 0.35, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#b0e0e6";
      ctx.fill();
      ctx.stroke();
      break;
    default:
      // 狐狸耳朵
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.7);
      ctx.lineTo(-r * 0.3, -r * 1.1);
      ctx.lineTo(-r * 0.1, -r * 0.7);
      ctx.closePath();
      ctx.moveTo(r * 0.6, -r * 0.7);
      ctx.lineTo(r * 0.3, -r * 1.1);
      ctx.lineTo(r * 0.1, -r * 0.7);
      ctx.closePath();
      ctx.fillStyle = "#ffdab9";
      ctx.fill();
      ctx.stroke();
      break;
  }

  // 臉部表情（眼睛、鼻子、嘴巴）
  // 眼睛
  ctx.beginPath();
  ctx.arc(-r * 0.25, -r * 0.15, r * 0.09, 0, 2 * Math.PI);
  ctx.arc(r * 0.25, -r * 0.15, r * 0.09, 0, 2 * Math.PI);
  ctx.fillStyle = "#222";
  ctx.fill();

  // 鼻子
  ctx.beginPath();
  ctx.arc(0, r * 0.05, r * 0.07, 0, 2 * Math.PI);
  ctx.fillStyle = "#a0522d";
  ctx.fill();

  // 嘴巴
  ctx.beginPath();
  ctx.arc(0, r * 0.22, r * 0.13, 0, Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#a0522d";
  ctx.stroke();

  // 選項文字
  ctx.font = "bold 24px Microsoft JhengHei"; // 字變大
  ctx.fillStyle = "#444";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, r * 0.6);

  ctx.restore();
}

// 炸彈繪製
function drawBomb(x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  // 主體
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 2 * Math.PI);
  ctx.fillStyle = "#444";
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 3;
  ctx.stroke();
  // 引線
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(0, -r - 20);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 3;
  ctx.stroke();
  // 火花
  ctx.beginPath();
  ctx.arc(0, -r - 25, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff0";
  ctx.fill();
  // 臉
  ctx.beginPath();
  ctx.arc(-10, 5, 7, 0, 2 * Math.PI);
  ctx.arc(10, 5, 7, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-10, 5, 3, 0, 2 * Math.PI);
  ctx.arc(10, 5, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 15, 10, 0, Math.PI);
  ctx.strokeStyle = "#f66";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

// 可愛記分板
function drawScoreBoard() {
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(canvas.width - 180, 40);
  ctx.quadraticCurveTo(canvas.width - 60, 0, canvas.width - 40, 60);
  ctx.quadraticCurveTo(canvas.width - 10, 120, canvas.width - 120, 110);
  ctx.quadraticCurveTo(canvas.width - 200, 100, canvas.width - 180, 40);
  ctx.closePath();
  ctx.fillStyle = "#fffbe8";
  ctx.shadowColor = "#ffb6c1";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#ffb6c1";
  ctx.lineWidth = 3;
  ctx.stroke();

  // 臉
  ctx.beginPath();
  ctx.arc(canvas.width - 110, 70, 18, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffe4e1";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvas.width - 120, 65, 4, 0, 2 * Math.PI);
  ctx.arc(canvas.width - 100, 65, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffb6c1";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvas.width - 110, 78, 7, 0, Math.PI);
  ctx.strokeStyle = "#ffb6c1";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 分數文字
  ctx.font = "bold 22px Microsoft JhengHei";
  ctx.fillStyle = "#ff69b4";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("分數", canvas.width - 110, 45);
  ctx.font = "bold 28px Arial";
  ctx.fillStyle = "#d2691e";
  ctx.fillText(score, canvas.width - 110, 90);

  ctx.restore();
}

function detectGrab(landmarks) {
  for (const balloon of balloons) {
    let hit = false;
    for (let i = 0; i < landmarks.length; i++) {
      const lm = landmarks[i];
      const x = lm.x * canvas.width;
      const y = lm.y * canvas.height;
      const dx = x - balloon.x;
      const dy = y - balloon.y;
      if (Math.sqrt(dx * dx + dy * dy) < balloon.radius) {
        hit = true;
        break;
      }
    }

    if (hit) {
      if (balloon.isBomb) {
        score = Math.max(0, score - 5);
        // 炸彈抖動
        balloon.shakeTime = 15;
      } else if (correctAnswers.includes(balloon.text)) {
        score += 5;
        // 正確答案才消失
        balloons = balloons.filter(b => b !== balloon);
      } else {
        score = Math.max(0, score - 3);
        // 錯誤答案抖動
        balloon.shakeTime = 15;
      }
      break;
    }
  }
  if (score >= 25 && !gameEnded) {
    gameEnded = true;
    startText.innerText = "🎉 遊戲結束！🎉";
    startText.style.display = "block";
  }
}

function detectStartGesture(landmarks) {
  // 大拇指指尖 4，食指指尖 8，距離很近即代表開始手勢
  const thumb = landmarks[4];
  const index = landmarks[8];
  const dx = thumb.x - index.x;
  const dy = thumb.y - index.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 0.1;
}

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 0,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawScoreBoard();

  // 顯示問題字幕
  if (gameStarted && !gameEnded) {
    ctx.save();
    ctx.font = "bold 32px Microsoft JhengHei";
    ctx.fillStyle = "#ff69b4";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("在教科系上，哪些是重要的學習內容？", canvas.width / 2, 20);
    ctx.restore();
  }

  if (gameStarted && !gameEnded) {
    drawBalloons();
  }

  if (results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach(landmarks => {
      // 這裡畫藍色骨架線和粉紅色圓點
      drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, { color: '#3399ff', lineWidth: 4 });
      drawLandmarks(ctx, landmarks, { color: '#ff69b4', fillColor: '#ff69b4', lineWidth: 2, radius: 12 });

      if (!gameStarted && detectStartGesture(landmarks)) {
        gameStarted = true;
        startText.innerText = "遊戲開始！";
        startText.style.display = "block";
        setTimeout(() => startText.style.display = "none", 1000);
      }

      if (gameStarted && !gameEnded) {
        detectGrab(landmarks);
      }
    });
  }

  const now = Date.now();
  if (gameStarted && !gameEnded && now - lastBalloonTime > 1200 + Math.random() * 800) {
    spawnBalloonOrBomb();
    lastBalloonTime = now;
  }
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});
camera.start();