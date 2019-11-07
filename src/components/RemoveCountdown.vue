<script>
export default {
  name: 'RemoveCountdown',
  props: {
    stepsCount: {
      default: 5,
      type: Number,
    },
  },
  data() {
    const circumference = 12 * Math.PI;

    return {
      currentStep: 5,
      circumference,
      circleAttrs: {
        cx: 8,
        cy: 8,
        fill: 'transparent',
        r: 6,
        'stroke-dasharray': circumference,
        'stroke-width': 1.5,
      },
    };
  },
  computed: {
    strokePassedDashoffset() {
      return this.circumference - (this.currentStep) / this.stepsCount * this.circumference;
    },
  },
  cssRules() {
    return {
      '.{ring}': {
        stroke: this.$gui.savedCardsDeleteTextColor,
      },
      '.{currentStep}': {
        color: this.$gui.savedCardsDeleteTextColor,
      },
    };
  },

  mounted() {
    setTimeout(() => {
      this.currentStep -= 1;
    }, 10);
    const interval = setInterval(() => {
      this.currentStep -= 1;

      if (this.currentStep < 0) {
        this.currentStep = this.stepsCount;
      }
    }, 1000);
    this.$on('hook:destroyed', () => {
      clearInterval(interval);
    });
  },
};
</script>

<template>
<div :class="$style.removeCountdown">
  <svg height="16" width="16">
    <circle
      v-bind="circleAttrs"
      :class="$style.ring"
      transform="rotate(90 8 8)"
      :style="{ strokeDashoffset: strokePassedDashoffset }"
    />
  </svg>

  <div :class="$style.currentStep">{{ currentStep + 1 }}</div>
</div>
</template>

<style lang="scss" module>
.removeCountdown {
  position: relative;
  width: 16px;
  height: 16px;
}
.ring {
  transition: stroke-dashoffset 1s linear;
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
}
.currentStep {
  position: absolute;
  top: 0.7px;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-family: PT Mono;
  font-weight: bold;
  font-size: 9px;
  line-height: 16px;
}
</style>
