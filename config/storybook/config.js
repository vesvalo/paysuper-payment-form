/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { configure, addDecorator } from '@storybook/vue';
import '../../src/vueExtentions';
import '../../src/globalComponents';
import '../../src/assets/styles/storybook-setup.scss';
import viewSchemes from '../../src/viewSchemes';
import i18n from '../../src/i18n';
import localesScheme from '../../src/locales/scheme';

Vue.prototype.$gui = viewSchemes.dark;

Vue.prototype.$changeLocale = function changeLocale(locale) {
  this.$i18n.locale = locale;
  const dir = localesScheme[locale].rtl ? 'rtl' : 'ltr';
  document.body.style.direction = dir;
};

const req = require.context('../../src/stories', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(() => ({
  template: '<div><story/></div>',
  i18n,
  created() {
    this.$changeLocale('en-US');
  },
}));

configure(loadStories, module);
