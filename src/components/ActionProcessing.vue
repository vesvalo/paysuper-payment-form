<script>
import { includes } from 'lodash-es';
import IconTotemFail from '@/components/IconCardSecurity.vue';
import IconTotemSuccess from '@/components/IconProcessSecurity.vue';

export default {
  name: 'ActionProcessing',

  components: {
    IconTotemFail,
    IconTotemSuccess,
  },

  props: {
    icon: {
      type: String,
      default: 'card',
      validator(value) {
        return includes(['card', 'other'], value);
      },
    },
  },

  mounted() {
    this.$addCssRules({
      [`.${this.$style.actionProcessing}:before`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
    });
  },
};
</script>

<template>
  <div :class="$style.actionProcessing">
    <div :class="$style.content">
      <div :class="$style.icon">
        <IconTotemFail v-if="icon === 'card'" />
        <IconTotemSuccess v-if="icon === 'other'" />
      </div>
      <div>
        <h2
          :class="$style.titleMain"
          v-html="$t('ActionProcessing.title')"
        >
        </h2>
      </div>
      <div
        :class="$style.description"
      >
        <span
          v-for="(chunk, index) in $t('ActionProcessing.description')"
          v-html="chunk"
          :key="index"
        ></span>
      </div>
      <div :class="$style.preloader">
        <UiSimplePreloader />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.actionProcessing {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 40px 20px;

  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    opacity: 0.95;
  }
}

.content {
  position: relative;
  z-index: 2;
}

.icon {
  margin-bottom: 24px;
  padding-top: 40px;
}

.titleMain {
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 18px;
}

.description {
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.preloader {
  margin-top: 60px;
}
</style>
