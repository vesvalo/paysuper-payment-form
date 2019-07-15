window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

export function config() {
  gtag('config', ...arguments);
}

export function set() {
  gtag('set', ...arguments);
}

export function event() {
  gtag('event', ...arguments);
}

gtag('js', new Date());
