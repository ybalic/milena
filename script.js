/**
 * ============================================================================
 * PRESSEL EXCLUSIVA • MILENA
 * Sistema de Partículas de Corações Flutuantes & Interações de Alta Conversão
 * ============================================================================
 */

// ==========================================
// 1. CONFIGURAÇÃO DE LINKS DE DESTINO
// (Substitua pelos seus links reais)
// ==========================================
const PRESSEL_CONFIG = {
  // Link para o BOTÃO 1 (Grupo de Prévias - ex: Telegram, WhatsApp, etc.)
  urlPrevias: "https://t.me/+u_teyCuWLs02Njdh",

  // Link para o BOTÃO 2 (Conteúdo Exclusivo - ex: Privacy, OnlyFans, Checkout, etc.)
  urlExclusivo: "https://t.me/milenisafabot?start=pressel",

  // Opção de abrir em nova aba (true) ou mesma aba (false)
  openInNewTab: true,

  // Feedback tátil em smartphones que suportam vibração
  enableHaptics: true
};

// ==========================================
// 2. SISTEMA DE CORAÇÕES FLUTUANTES (CANVAS)
// ==========================================
class FloatingHeartsCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.hearts = [];
    this.animationFrameId = null;
    this.dpr = window.devicePixelRatio || 1;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Determina a quantidade ideal de partículas conforme a tela
    const isMobile = window.innerWidth <= 768;
    const heartCount = isMobile ? 28 : 42;

    for (let i = 0; i < heartCount; i++) {
      // Inicia com posições Y distribuídas aleatoriamente por toda a altura
      this.hearts.push(this.createHeart(true));
    }

    this.animate = this.animate.bind(this);
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createHeart(randomY = false) {
    // Variação de tons vermelhos e rubis sofisticados
    const redHues = [
      'rgba(255, 23, 68, ',   // Neon Vermelho
      'rgba(229, 9, 20, ',    // Vermelho Intenso
      'rgba(255, 64, 129, ',  // Rosa Rubro
      'rgba(255, 42, 85, ',   // Carmesim
      'rgba(183, 5, 13, '     // Vinho Profundo
    ];

    const size = Math.random() * 14 + 8; // Tamanho entre 8px e 22px
    const baseAlpha = Math.random() * 0.45 + 0.25; // Opacidade base entre 0.25 e 0.7

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + size + Math.random() * 50,
      size: size,
      speedY: Math.random() * 0.65 + 0.45, // Velocidade suave
      wobbleSpeed: Math.random() * 0.03 + 0.015,
      wobbleAmplitude: Math.random() * 25 + 10,
      wobbleOffset: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.35,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      colorPrefix: redHues[Math.floor(Math.random() * redHues.length)],
      baseAlpha: baseAlpha,
      currentAlpha: baseAlpha
    };
  }

  drawHeart(x, y, size, color, rotation) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;

    // Desenha forma vetorial precisa de coração
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);

    // Lado esquerdo do coração
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight,
      -size, size / 3,
      0, size
    );

    // Lado direito do coração
    ctx.bezierCurveTo(
      size, size / 3,
      size / 2, -topCurveHeight,
      0, topCurveHeight
    );

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.hearts.length; i++) {
      const h = this.hearts[i];

      // Movimento vertical para cima
      h.y -= h.speedY;

      // Movimento oscilatório suave horizontal
      h.wobbleOffset += h.wobbleSpeed;
      const currentX = h.x + Math.sin(h.wobbleOffset) * (h.wobbleAmplitude * 0.5);
      h.rotation += h.rotationSpeed;

      // Desvanecimento suave conforme sobe (desaparece nos últimos 20% do topo)
      const fadeStart = this.height * 0.25;
      if (h.y < fadeStart) {
        h.currentAlpha = (h.y / fadeStart) * h.baseAlpha;
      } else {
        h.currentAlpha = h.baseAlpha;
      }

      if (h.currentAlpha > 0.01) {
        const fillColor = `${h.colorPrefix}${Math.max(0, h.currentAlpha)})`;
        this.drawHeart(currentX, h.y, h.size, fillColor, h.rotation);
      }

      // Reinicia o coração na parte inferior quando sai da tela
      if (h.y < -h.size * 2 || h.currentAlpha <= 0.01) {
        this.hearts[i] = this.createHeart(false);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
}

// ==========================================
// 3. EFEITOS DE CLIQUE & INTERAÇÕES
// ==========================================
function setupInteractions() {
  const btnPrevias = document.getElementById('btn-previas');
  const btnExclusivo = document.getElementById('btn-exclusivo');

  function handleButtonClick(e, targetUrl) {
    // Efeito de onda / ripple
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const size = Math.max(rect.width, rect.height);
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2);

    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // Feedback tátil em celular
    if (PRESSEL_CONFIG.enableHaptics && navigator.vibrate) {
      navigator.vibrate(15);
    }

    // Se o link for '#' ou padrão, atualiza para o link configurado
    if (targetUrl && !targetUrl.startsWith('#')) {
      e.preventDefault();
      setTimeout(() => {
        if (PRESSEL_CONFIG.openInNewTab) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = targetUrl;
        }
      }, 150);
    }
  }

  if (btnPrevias) {
    btnPrevias.addEventListener('click', (e) => {
      handleButtonClick(e, PRESSEL_CONFIG.urlPrevias);
    });
  }

  if (btnExclusivo) {
    btnExclusivo.addEventListener('click', (e) => {
      handleButtonClick(e, PRESSEL_CONFIG.urlExclusivo);
    });
  }

  // Permite passar parâmetros de tracking (UTMs) automaticamente se existirem na URL da pressel
  preserveUTMs();
}

/**
 * Repassa automaticamente parâmetros UTMs e SRC da URL atual para os links
 */
function preserveUTMs() {
  const currentParams = window.location.search;
  if (!currentParams) return;

  ['urlPrevias', 'urlExclusivo'].forEach((key) => {
    const originalUrl = PRESSEL_CONFIG[key];
    if (originalUrl && !originalUrl.startsWith('#')) {
      try {
        const urlObj = new URL(originalUrl);
        const searchParams = new URLSearchParams(currentParams);
        searchParams.forEach((val, paramKey) => {
          urlObj.searchParams.set(paramKey, val);
        });
        PRESSEL_CONFIG[key] = urlObj.toString();
      } catch (err) {
        // Formato de link simples
        PRESSEL_CONFIG[key] += (originalUrl.includes('?') ? '&' : '?') + currentParams.substring(1);
      }
    }
  });
}

// ==========================================
// 4. INICIALIZAÇÃO AO CARREGAR A PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  new FloatingHeartsCanvas('hearts-canvas');
  setupInteractions();
});
