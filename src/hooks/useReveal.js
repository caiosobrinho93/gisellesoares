import { useEffect } from 'react';

/**
 * Hook for 'Editorial Reveal' intersection animations.
 * Applies the .visible class to elements with .editorial-reveal when they enter the viewport.
 */
export default function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = document.querySelectorAll('.editorial-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
