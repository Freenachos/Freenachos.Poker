'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Site-wide scroll reveal. Watches every [data-reveal] element and adds
 * `.is-in` once it enters the viewport. Styles live in app/globals.css and
 * only apply under `html.motion-ok`, so content is never hidden without JS.
 * A MutationObserver picks up elements mounted later (expanders, route
 * changes), so nothing added after load can get stuck invisible.
 */
const MotionRoot = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.documentElement.classList.remove('motion-ok');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );

    const watch = (root) => {
      if (root.nodeType !== 1) return;
      if (root.matches?.('[data-reveal]:not(.is-in)')) io.observe(root);
      root.querySelectorAll?.('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    };

    watch(document.body);

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach(watch));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
};

export default MotionRoot;
