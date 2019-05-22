import Vue from 'vue';
import {
  extend,
  forEach,
  get,
  includes,
  isEmpty,
  keys,
  map,
  pickBy,
  reduce,
  startsWith,
} from 'lodash-es';

function varsToCssObject(component, componentVars) {
  switch (component) {
    case 'button':
      return {
        container: {
          color: componentVars.buttonColor,
          'background-color': componentVars.buttonBoxColor,
          'justify-content': componentVars.buttonAlign,
          hover: {
            'background-color': componentVars.buttonHoverBoxColor,
          },
          active: {
            'background-color': componentVars.buttonActiveBoxColor,
          },
          disabled: {
            opacity: componentVars.buttonDisabledOpacity,
          },
        },
        before: {
          color: componentVars.buttonBeforeColor,
          'margin-right': componentVars.buttonBeforeMargin,
        },
        after: {
          color: componentVars.buttonAfterColor,
          'margin-left': componentVars.buttonAfterMargin,
        },
      };
    case 'checkbox':
      return {
        container: {
          color: componentVars.checkboxColor,
          'border-color': componentVars.checkboxColor,
          hover: {
            color: componentVars.checkboxHoverColor,
            'border-color': componentVars.checkboxHoverColor,
          },
          checked: {
            color: componentVars.checkboxCheckedColor,
            'border-color': componentVars.checkboxCheckedColor,
          },
          disabled: {
            opacity: componentVars.checkboxDisabledOpacity,
          },
        },
        label: {
          'margin-left': componentVars.checkboxMargin,
        },
      };
    case 'input':
      return {
        input: {
          color: componentVars.inputColor,
          'background-color': componentVars.inputBoxColor,
          'border-color': componentVars.inputBorderColor,
        },
      };
    case 'preloader':
      return {
        container: {
          'border-color': componentVars.preloaderColor,
          'border-top-color': componentVars.preloaderSpinColor,
        },
      };
    default:
      return {};
  }
}

function objectToCss(obj) {
  return reduce(obj, (result, value, key) => `${result}${key}:${value};`, '');
}

function $addCssRules(component, selectors, modifires) {
  const componentVars = pickBy(this.$styles, (value, rule) => startsWith(rule, component));
  const cssObject = varsToCssObject(component, componentVars);

  forEach(selectors, (hashClass, selector) => {
    const cssElement = cssObject[selector];

    if (!isEmpty(cssElement)) {
      const cssActive = objectToCss(cssElement.active);
      const cssHover = objectToCss(cssElement.hover);
      const cssMain = objectToCss(
        pickBy(cssElement, (value, key) => !includes(['hover', 'active', ...keys(modifires)], key)),
      );
      const cssModifires = reduce(
        modifires,
        (result, value, key) => ({ ...result, [value]: objectToCss(cssElement[key]) }),
        {},
      );

      const styleElement = document.createElement('style');

      styleElement.type = 'text/css';
      styleElement.innerHTML = `
        .${hashClass} {${cssMain}}
        ${cssActive && `.${hashClass}:active {${cssActive}}`}
        ${cssHover && `.${hashClass}:hover {${cssHover}}`}
        ${map(cssModifires, (cssModifire, classModifire) => `.${hashClass}.${classModifire} {${cssModifire}}`).join('')}
      `;

      console.error(styleElement.innerHTML);
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
