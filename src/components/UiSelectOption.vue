<template>
<label :class="[$style.option, { [$style._empty]: optionIsEmpty }]">
  <div
    v-if="option.iconComponent"
    :class="$style.icon"
  >
    <component :is="option.iconComponent" />
  </div>

  <div :class="$style.label">
    {{ option.label }}
  </div>

  <input
    type="radio"
    :class="$style.input"
    :name="selectId"
    :value="option.value"
    @input="$emit('input', option.value)"
  >
</label>
</template>

<script>
import { isEmpty } from 'lodash-es';

export default {
  props: {
    option: {
      default: () => ({}),
      type: Object,
    },
    selectId: {
      default: 'select',
      type: String,
    },
  },
  computed: {
    optionIsEmpty() {
      return isEmpty(this.option) || this.option.value === '';
    },
  },
};
</script>

<style module lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400|Quicksand&subset=cyrillic,cyrillic-ext');
@import '@/assets/styles/directional.scss';

$font-family: 'Quicksand', 'Comfortaa', sans-serif;

$background-color: transparent;
$input-color: #fff;
$border-color: rgba(255, 255, 255, 0.2);
$hover-border-color: rgba(255, 255, 255, 0.5);
$hover-option-color: #06eaa7;
$disabled-opacity: 0.7;

.option {
  cursor: pointer;
  display: flex;
  height: 40px;
  line-height: 24px;
  margin: 0;
  border-bottom: 1px solid $border-color;
  padding-top: 16px;

  &:hover {
    color: $hover-option-color;
    border-color: $hover-border-color;
  }

  &._empty {
    display: none;
  }
}
.icon {
  @include if-ltr {
    margin-right: 12px;
  }

  @include if-rtl {
    margin-left: 12px;
  }
}
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input {
  height: 0;
  visibility: hidden;
  width: 0;
}
</style>
