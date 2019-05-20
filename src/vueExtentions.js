import Vue from 'vue';
import {
  extend,
  forEach,
  get,
  includes,
  isObject,
  reduce,
} from 'lodash-es';

function $addCssRules(component, selectors, states) {
  forEach(selectors, (hashClass, selector) => {
    forEach(states, (state) => {
      const cssObject = get(this.$styles, [component, selector, state], false);

      if (cssObject && isObject(cssObject)) {
        const css = reduce(cssObject, (result, value, key) => (`${result}${key}:${value};`), '');
        const styleElement = document.createElement('style');

        styleElement.type = 'text/css';
        styleElement.innerHTML = `
          .${hashClass}${includes(['default', 'disabled'], state) ? '' : `:${state}`} {${css}}
        `;
        styleElement.appendChild(document.createTextNode(''));

        document.head.appendChild(styleElement);
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
