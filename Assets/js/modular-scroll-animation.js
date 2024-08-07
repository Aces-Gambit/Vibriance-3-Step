// Global configuration variables
const HARDWARE_CONCURRENCY_THRESHOLD = 4;
const OBSERVER_THRESHOLD = .8;
const STAGGER_DELAY_SECONDS = .1; // 200ms between each element
const DEBUG_MODE = false;

document.addEventListener('DOMContentLoaded', () => {
  const targetElement = document.body;

  if (DEBUG_MODE || navigator.hardwareConcurrency > HARDWARE_CONCURRENCY_THRESHOLD ) {
    // Initialize MutationObserver for high-concurrency devices
    const highConcurrencyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && (node.matches('[data-enter], [data-enter-stagger], [data-enter-text], [data-enter-bg]'))) {
            observeElement(node);
          }
        });
      });
    });

    if (targetElement) {
      highConcurrencyObserver.observe(targetElement, { childList: true, subtree: true });
    }
  } else {
    // Initialize MutationObserver for low-concurrency devices
    const lowConcurrencyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && (node.matches('[data-enter], [data-enter-stagger], [data-enter-text], [data-enter-bg]'))) {
            node.classList.add('no-animation');
          }
        });
      });
    });

    if (targetElement) {
      lowConcurrencyObserver.observe(targetElement, { childList: true, subtree: true });
    }
  }

  // Initial scan for elements already in the DOM
  document.querySelectorAll('[data-enter], [data-enter-stagger], [data-enter-text], [data-enter-bg]').forEach(el => {
    if (navigator.hardwareConcurrency > HARDWARE_CONCURRENCY_THRESHOLD) {
      observeElement(el);
    } else {
        if (el.hasAttribute('data-enter-stagger')) {
          // Apply no-animation to each child of the parent with data-enter-stagger
          Array.from(el.children).forEach(child => {
            child.classList.add('no-animation');
          });
        } else {
          // Apply no-animation directly for elements with data-enter or data-enter-text
          el.classList.add('no-animation');
        }
    }
});
});

function observeElement(el) {
  const viewportHeight = window.innerHeight;
  const elementHeight = el.getBoundingClientRect().height;
  let dynamicThreshold = OBSERVER_THRESHOLD;

  if ((elementHeight * OBSERVER_THRESHOLD) > viewportHeight) {
    dynamicThreshold = (viewportHeight * 0.5) / elementHeight;
  }
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        applyAnimations(entry, observer);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: dynamicThreshold });

  observer.observe(el);
}

function applyAnimations(entry, observer) {
  if (entry.target.hasAttribute('data-enter')) {
    applyDirectionalAnimation(entry.target);
  }

  if (entry.target.hasAttribute('data-enter-stagger')) {
    applyStaggeredAnimation(entry.target);
  }

  if (entry.target.hasAttribute('data-enter-text')) {
    applyTextAnimation(entry.target);
  }
  
  if (entry.target.hasAttribute('data-enter-bg')) {
    applyBgAnimation(entry.target);
  }
}

function applyDirectionalAnimation(element) {
  const direction = element.getAttribute('data-enter');
  element.classList.add(`enter-${direction}`);
}

function applyStaggeredAnimation(parent) {
  const direction = parent.getAttribute('data-enter-stagger') || 'left'; // Default to 'left'
  const children = parent.children;

  Array.from(children).forEach((child, index) => {
    const delay = index * STAGGER_DELAY_SECONDS;
    child.style.animationDelay = `${delay}s`;
    child.classList.add(`enter-${direction}`); // Apply the direction class
    console.log(`Staggered animation applied to child with delay: ${delay}s and direction: ${direction}`);
  });
}

function applyTextAnimation(element) {
  const text = element.innerText;
  const textParent = element.closest("[data-enter-text]");
  textParent.classList.add(`text-parent-opacity-active`);
  const lines = text.split('\n').map(line => `<span class="text-enter">${line}</span>`);
  element.innerHTML = lines.join('<br>');
}

function applyBgAnimation(element) {
  element.classList.add(`bg-enter`);
}