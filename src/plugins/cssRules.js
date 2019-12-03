import Vue from 'vue';
import { $addCssRules } from '@/vueExtentions';

Vue.mixin({
  created() {
    const { cssRules } = this.$options;
    if (cssRules) {
      $addCssRules.call(this, cssRules.call(this));
    }
  },
});
