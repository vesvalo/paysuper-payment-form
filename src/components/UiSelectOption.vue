<template>
<label :class="[$style.option, { [$style._empty]: optionIsEmpty }]">
  <div
    v-if="option.iconComponent"
    :class="[$style.icon, $style[`_${iconPosition}`]]"
  >
    <component :is="option.iconComponent" />
  </div>

  <div :class="$style.label">
    {{ option.label }}

    <div :class="$style.additionalLabel">
      {{ option.additional }}
    </div>
  </div>

  <div
    v-if="isRemovable"
    :class="$style.remove"
    @click.prevent="$emit('remove')"
  >
    {{ $t('UiSelectOption.remove') }}
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
import { includes, isEmpty } from 'lodash-es';

export default {
  props: {
    isRemovable: {
      default: false,
      type: Boolean,
    },
    iconPosition: {
      default: 'left',
      type: String,
      validator(value) {
        return includes(['left', 'right'], value);
      },
    },
    /**
     * @type {{ label: string, value: string, iconComponent?: string, additional?: string }}
     */
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
  mounted() {
    this.$addCssRules({
      [`.${this.$style.option}`]: {
        color: this.$gui.selectColor,
        'border-color': this.$gui.selectBorderColor,
      },
      [`.${this.$style.option}:hover`]: {
        color: this.$gui.selectFocusBorderColor,
        'border-color': this.$gui.selectHoverBorderColor,
      },
      [`.${this.$style.remove}`]: {
        color: this.$gui.selectRemoveColor,
      },
    });
  },
};
</script>

<style module lang="scss">
.option {
  cursor: pointer;
  display: flex;
  height: 40px;
  line-height: 24px;
  margin: 0;
  border-bottom: 1px solid transparent;
  padding-top: 16px;

  &:hover {
    & > .remove {
      display: block;
    }
  }

  &._empty {
    display: none;
  }
}
.remove {
  display: none;
  font-size: 12px;
  padding: 0 2px;
}
.icon {
  display: flex;
  align-items: center;

  &._right {
    order: 2;

    @include if-ltr {
      margin: 0 0 0 12px;
    }

    @include if-rtl {
      margin: 0 12px 0 0;
    }
  }

  @include if-ltr {
    margin: 0 12px 0 0;
  }

  @include if-rtl {
    margin: 0 0 0 12px;
  }
}
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
}
.additionalLabel {
  display: inline-block;
  font-size: 10px;

  @include if-ltr {
    margin: 0 0 0 16px;
  }

  @include if-rtl {
    margin: 0 16px 0 0;
  }
}
.input {
  height: 0;
  visibility: hidden;
  width: 0;
}
</style>
