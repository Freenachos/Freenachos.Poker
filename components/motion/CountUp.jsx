'use client';

import { useEffect, useRef, useState } from 'react';

// '$5.5M+' -> { prefix: '$', number: 5.5, decimals: 1, suffix: 'M+' }
const parse = (value) => {
  const m = String(value).match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const raw = m[2].replace(/,/g, '');
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { prefix: m[1], number: parseFloat(raw), decimals, suffix: m[3], grouped: m[2].includes(',') };
};

const format = (n, p) => {
  const fixed = n.toFixed(p.decimals);
  if (!p.grouped) return fixed;
  const [int, frac] = fixed.split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (frac ? `.${frac}` : '');
};

/**
 * Counts a formatted figure up from zero the first time it scrolls into view.
 * Server-renders the final value, so it reads correctly without JS and for
 * crawlers; reduced-motion visitors get the final value with no count.
 */
const CountUp = ({ value, duration = 1600, delay = 0 }) => {
  const parsed = parse(value);
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!parsed || !el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf;
    let timer;
    setDisplay(`${parsed.prefix}${format(0, parsed)}${parsed.suffix}`);

    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(`${parsed.prefix}${format(parsed.number * eased, parsed)}${parsed.suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(run, delay);
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      setDisplay(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, delay]);

  return (
    <span ref={ref} className="tnum" aria-label={String(value)}>
      {display}
    </span>
  );
};

export default CountUp;
