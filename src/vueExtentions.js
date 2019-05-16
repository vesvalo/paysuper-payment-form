import Vue from 'vue';
import { forEach, get, extend } from 'lodash-es';

function $addCssRules(selectors, states) {
  console.error(selectors, states, this.$styles);
  forEach(selectors, (hashClass, selector) => {
    forEach(states, (state) => {
      const css = get(this.$styles, ['button', selector, state], null);

      if (css) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = `${hashClass}${state && state !== 'default' ? `:${state}` : ''} ${css}`;
        // styleElement.appendChild(document.createTextNode(''));
        document.head.appendChild(styleElement);

        const styleSheet = styleElement.sheet;
        // styleSheet.insertRule(`${hashClass}${state && state !== 'default' ? `:${state}` : ''} ${css}`);
        console.error(styleSheet);
      }
    });
  });
}

function $getFieldErrorMessages(fieldPath) {
  const field = get(this.$v, fieldPath);

  if (!field) {
    return [];
  }

  return Object.keys(field.$params).filter(name => !field[name])
    .map((name) => {
      const message = this.$t(`errorMessages.${name}`);
      const params = field.$params[name];
      return message.replace(/%(.+?)%/g, (a, variable) => params[variable]);
    });
}

function $isFieldInvalid(fieldPath) {
  const field = get(this.$v, fieldPath);
  if (!field) {
    return false;
  }
  return Boolean(field.$invalid && field.$dirty);
}

extend(Vue.prototype, {
  $addCssRules,
  $getFieldErrorMessages,
  $isFieldInvalid,
});
