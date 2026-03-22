let ctx: AudioContext | null = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

export function playSwipeRight() {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.frequency.setValueAtTime(440, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.1);
    g.gain.setValueAtTime(0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    o.start(); o.stop(c.currentTime + 0.2);
  } catch {}
}

export function playSwipeLeft() {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.frequency.setValueAtTime(440, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    o.start(); o.stop(c.currentTime + 0.2);
  } catch {}
}

export function playSuperLike() {
  try {
    const c = getCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.2, c.currentTime + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.07 + 0.15);
      o.start(c.currentTime + i * 0.07);
      o.stop(c.currentTime + i * 0.07 + 0.15);
    });
  } catch {}
}
