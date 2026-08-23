(() => {
  const mobileCta = document.querySelector('.mobile-cta');
  const hideRegions = [...document.querySelectorAll('.ad-program, .ad-conditions, #request')];
  if (!mobileCta || !hideRegions.length) return;

  const updateMobileCta = () => {
    const intersects = hideRegions.some((region) => {
      const rect = region.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    mobileCta.style.display = intersects ? 'none' : '';
  };

  updateMobileCta();
  window.addEventListener('scroll', updateMobileCta, { passive: true });
  window.addEventListener('resize', updateMobileCta, { passive: true });
})();
