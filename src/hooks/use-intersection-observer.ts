import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(threshold = 0.1) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    const current = ref.current

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold]);

  return [ref, isIntersecting] as const;
}
