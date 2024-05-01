//callback은 IntersectionObserverCallback
//target은 HTMLDivElement,
//

export const useIntersectionObserver = (callback, target, options) => {
  const observer = new IntersectionObserver(callback, options);
  if (!target) return;
  observer.observe(target);
  return () => observer.disconnect();
};
