import makeClown from './clown';

const MUTATION_CONFIG = { childList: true, subtree: true };
const DEBOUNCE_TIME = 100;
const ELEMENT_SELECTOR = 'a>[style^=\'clip-path: url("#hex-hw-shapeclip\']:first-child';

window.addEventListener('load', () => {
  let debounceTimeout: number;
  let observer: IntersectionObserver;

  const updateObservedElements = () => {
    [...document.querySelectorAll(ELEMENT_SELECTOR)]
      .forEach((p) => observer.observe(p));
  };

  const mutObserver = new MutationObserver(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      updateObservedElements();
    }, DEBOUNCE_TIME);
  });

  observer = new IntersectionObserver((entries, intersectionObserver) => {
    mutObserver.disconnect();
    entries.filter(({ isIntersecting }) => isIntersecting).forEach(({ target }) => {
      if (target instanceof HTMLElement) {
        intersectionObserver.unobserve(target);
        if (target.parentElement instanceof HTMLElement) {
          const href = target.parentElement.getAttribute('href')?.replace('/nft', '');
          // eslint-disable-next-line
          target.parentElement.innerHTML = makeClown(href || '');
        }
      }
    });
    mutObserver.observe(document.body, MUTATION_CONFIG);
  }, { threshold: 0.1 });

  mutObserver.observe(document.body, MUTATION_CONFIG);

  document.querySelectorAll(ELEMENT_SELECTOR).forEach((p) => observer.observe(p));
});
