/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { configure } from '@storybook/vue';
import '../../src/vueExtentions';
import viewSchemes from '../../src/viewSchemes';
import '../../src/assets/styles/storybook-setup.scss';

Vue.prototype.$gui = viewSchemes.dark;

const req = require.context('../../src/stories', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
