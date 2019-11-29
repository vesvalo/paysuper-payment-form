<script>
import { includes } from 'lodash-es';
import IconCardSecurity from '@/components/IconCardSecurity.vue';
import IconProcessSecurity from '@/components/IconProcessSecurity.vue';

export default {
  name: 'ActionProcessing',

  components: {
    IconCardSecurity,
    IconProcessSecurity,
  },

  props: {
    type: {
      type: String,
      default: 'simpleLoading',
      validator(value) {
        return includes(['simpleLoading', 'paymentLoading', 'systemSuccess', '3ds'], value);
      },
    },
  },

  computed: {
    types() {
      return {
        simpleLoading: {},
        paymentLoading: {
          title: this.$t('ActionProcessing.paymentLoading.title'),
          iconComponent: 'IconCardSecurity',
          description: this.$t('ActionProcessing.paymentLoading.description'),
        },
        '3ds': {
          title: this.$t('ActionProcessing.3ds.title'),
          iconComponent: 'IconCardSecurity',
          description: this.$t('ActionProcessing.3ds.description'),
        },
        systemSuccess: {
          title: this.$t('ActionProcessing.systemSuccess.title'),
          iconComponent: 'IconProcessSecurity',
          description: this.$t('ActionProcessing.systemSuccess.description'),
        },
      };
    },
    content() {
      return this.types[this.type];
    },
  },

  created() {
    this.$addCssRules({
      [`.${this.$style.actionProcessing}:before`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.titleMain}`]: {
        color: this.$gui.processTitleColor,
      },
      [`.${this.$style.description}`]: {
        color: this.$gui.processTextColor,
      },
    });
  },
};
</script>

<template>
<transition
  appear
  :enter-class="$style.enter"
  :enter-active-class="$style.enterActive"
  :enter-to-class="$style.enterTo"
  :leave-class="$style.leave"
  :leave-active-class="$style.leaveActive"
  :leave-to-class="$style.leaveTo"
>
  <div :class="$style.actionProcessing">
    <div :class="$style.content">
      <div
        v-if="content.iconComponent"
        :class="$style.icon"
      >
        <component :is="content.iconComponent" />
      </div>
      <div v-if="content.title">
        <h2
          :class="$style.titleMain"
          v-html="content.title"
        >
        </h2>
      </div>
      <div
        v-if="content.description"
        :class="$style.description"
        v-html="content.description"
      >
      </div>
      <div :class="$style.preloader">
        <UiSimplePreloader />
      </div>
    </div>
  </div>
</transition>
</template>

<style lang="scss" module>
.actionProcessing {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 40px 20px;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;

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
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 18px;
}

.description {
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.preloader {
  margin-top: 60px;
}

.enter,
.leaveTo {
  opacity: 0;
}
.enterTo,
.leave {
  opacity: 1;
}
.enterActive,
.leaveActive {
  transition: opacity 0.3s ease-in-out;
}
</style>
