import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
