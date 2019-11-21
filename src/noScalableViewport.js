const isMobile = window.innerWidth < 640 || window.innerHeight < 510;
const metaContent = isMobile
  ? 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no'
  : 'width=device-width,initial-scale=1';
const meta = document.querySelector('meta[name="viewport"]');

if (meta) {
  meta.setAttribute('content', metaContent);
} else {
  const newMeta = document.createElement('meta');
  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', metaContent);
  document.head.appendChild(newMeta);
}
