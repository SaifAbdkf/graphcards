export function animateViewport(
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void,
  from: { x: number; y: number; zoom: number },
  to: { x: number; y: number; zoom: number },
  duration = 500 // in ms
) {
  const start = performance.now();

  const animate = (now: number) => {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1); // normalized time [0, 1]

    const easeInOut = t * t * (3 - 2 * t);

    const x = from.x + (to.x - from.x) * easeInOut;
    const y = from.y + (to.y - from.y) * easeInOut;
    const zoom = from.zoom + (to.zoom - from.zoom) * easeInOut;

    setViewport({ x, y, zoom });

    if (t < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}
