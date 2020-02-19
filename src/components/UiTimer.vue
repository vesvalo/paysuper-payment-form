<script>
export default {
  props: {
    autoStart: {
      default: true,
      type: Boolean,
    },
    minWidth: {
      default: '',
      type: String,
    },
    time: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      timer: 0,
    };
  },
  cssRules() {
    return {
      '.{container}': { color: this.$gui.timerColor },
      '.{inner}': { border: `2px solid ${this.$gui.timerBorderColor}` },
      '.{shadow}': { 'background-color': this.$gui.timerShadowColor },
      '.{prepend} > svg > path, .{append} > svg > path': { fill: this.$gui.timerColor },
      '.{prepend} > svg > circle': { stroke: this.$gui.timerColor },
    };
  },
  created() {
    this.timer = this.time;

    if (this.autoStart) {
      this.startTimer();
    }
  },
  methods: {
    startTimer() {
      const intervalId = setInterval(() => {
        this.timer -= 1;

        if (this.timer <= 0) {
          this.$emit('endsTime');
          clearInterval(intervalId);
        }
      }, 1000);
    },
  },
};
</script>

<template>
<div
  :class="$style.container"
  :style="{ minWidth: minWidth || undefined }"
>
  <div :class="$style.shadow"></div>
  <div :class="$style.inner">
    <span :class="$style.prepend">
      <slot name="prepend" />
    </span>

    <div :class="$style.main">
      {{ timer }}
    </div>

    <span :class="$style.append">
      <slot name="append" />
    </span>
  </div>
</div>
</template>

<style module lang="scss">
$append-margin: 6px;
$prepend-margin: 6px;
$font-size: 16px;
$font-weight: 700;
$padding: 8px 6px;
$border-radius: 50px;

.container {
  position: relative;
  cursor: progress;
  outline-width: 0;
  font-family: inherit;
  font-size: $font-size;
  font-weight: $font-weight;
  border-radius: $border-radius;
  background-color: transparent;
}
.inner {
  position: relative;
  outline-width: 0;
  display: inline-flex;
  padding: $padding;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius;
  background-color: transparent;
  width: 100%;
  height: 100%;
}
.shadow {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 100%;
  height: 100%;
  border-radius: $border-radius;
}
.main,
.prepend,
.append {
  height: 20px;

  &:empty {
    display: none;
  }
}
.prepend {
  margin-left: $prepend-margin;
  margin-right: $prepend-margin;
}
.append {
  margin-left: $append-margin;
  margin-right: $append-margin;
}
</style>
