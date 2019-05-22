import Vue from 'vue';
import {
  extend,
  forEach,
  get,
  isEmpty,
  reduce,
} from 'lodash-es';

function objectToCss(obj) {
  return reduce(obj, (result, value, key) => `${result}${key}:${value};`, '');
}

function $addCssRules(rules) {
  forEach(rules, (rule, selector) => {
    if (!isEmpty(rule)) {
      const css = objectToCss(rule);
      const styleElement = document.createElement('style');

      styleElement.type = 'text/css';
      styleElement.innerHTML = `${selector} {${css}}`;
      styleElement.appendChild(document.createTextNode(''));

      document.head.appendChild(styleElement);
    }
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
