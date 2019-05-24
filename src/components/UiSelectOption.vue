<template>
<label :class="[$style.option, { [$style._empty]: option.value === '' }]">
  <div
    v-if="option.iconComponent"
    :class="$style.icon"
  >
    <component :is="option.iconComponent" />
  </div>

  {{ option.label }}

  <input
    v-model="selectValue"
    :class="$style.input"
    :name="selectId"
    type="radio"
    :value="option.value"
    @input="emitChange"
  >
</label>
</template>

<script>
export default {
  props: {
    option: {
      default: () => ({}),
      type: Array,
    },
    selectId: {
      default: 'select',
      type: String,
    },
  },
  methods: {
    emitChange({ target: { value } }) {
      this.blur();
      this.$emit('input', value);
    },
  },
};
</script>

<style module lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400|Quicksand&subset=cyrillic,cyrillic-ext');

$font-family: 'Quicksand', 'Comfortaa', sans-serif;

$background-color: transparent;
$input-color: #fff;
$border-color: rgba(255, 255, 255, 0.2);
$focus-border-color: #06eaa7;
$hover-option-color: #06eaa7;
$disabled-opacity: 0.7;

$primary-input-size: 16px;
$secondary-input-size: 14px;

.option {
  cursor: pointer;
  display: flex;
  height: 40px;
  line-height: 40px;
  margin: 0;

  &:hover {
    color: $hover-option-color;
  }

  &._empty {
    display: none;
  }
}
.icon {
  margin-right: 12px;
}
.input {
  height: 0;
  visibility: hidden;
  width: 0;
}
</style>
