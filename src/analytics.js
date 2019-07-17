const analyticsScript = document.createElement('script');
analyticsScript.async = true;
analyticsScript.src = '//www.googletagmanager.com/gtag/js?id=UA-142750977-1';
document.head.appendChild(analyticsScript);

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

export function gtagConfig() {
  gtag('config', ...arguments);
}

export function gtagSet() {
  gtag('set', ...arguments);
}

export function gtagEvent() {
  gtag('event', ...arguments);
}

gtag('js', new Date());
