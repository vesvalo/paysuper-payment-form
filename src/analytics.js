const analyticsScript = document.createElement('script');
analyticsScript.async = true;
analyticsScript.src = '//www.googletagmanager.com/gtag/js?id=UA-142750977-1';
document.head.appendChild(analyticsScript);

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

gtag('js', new Date());

export function gtagConfig() {
  gtag('config', ...arguments);
}

export function gtagSet() {
  gtag('set', ...arguments);
}

export function gtagEvent() {
  gtag('event', ...arguments);
}

export function getEcommerceItems(orderData) {
  if (orderData.items) {
    return orderData.items.map((item, index) => ({
      id: item.id,
      name: item.name,
      list_name: 'Cart items',
      list_position: index + 1,
      price: `${item.amount}`,
      quantity: 1,
    }));
  }

  return [{
    id: orderData.project.id,
    name: 'Simple Checkout',
    price: `${orderData.amount}`,
    quantity: 1,
  }];
}
