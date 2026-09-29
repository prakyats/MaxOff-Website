/**
 * Fade-and-rise on scroll, once per element. Elements opt in with the "reveal" class.
 * CSS only hides them when scripting is enabled and motion is allowed (see components.css),
 * so a failure here can never leave content invisible: everything is revealed on any error.
 */
function revealAll(elements: Iterable<Element>): void {
  for (const element of elements) element.classList.add('is-visible');
}

try {
  const targets = document.querySelectorAll('.reveal');
  if (targets.length > 0) {
    if (!('IntersectionObserver' in window)) {
      revealAll(targets);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
      );
      for (const target of targets) observer.observe(target);
    }
  }
} catch {
  revealAll(document.querySelectorAll('.reveal'));
}
