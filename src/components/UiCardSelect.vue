<template>
<div :class="$style.container">
  <UiSelect
    v-model="innerValue"
    v-bind="{ required, disabled, errorText, hasError, ...$attrs }"
    iconPosition="right"
    :isRemovable="true"
    :label="$t('Ui.cardNumber')"
    :options="options"
    :value="innerValue"
    @input="$emit('input', $event)"
    @focus="focused = true"
    @blur="focused = false"
    @remove="$emit('removeCard', $event)"
  >
    <div
      v-if="focused"
      slot="additional"
      :class="$style.anotherCard"
      @click="$emit('anotherCard')"
    >
      <IconPlus :class="$style.iconPlus" />
      {{ $t('Ui.anotherCard') }}
    </div>
  </UiSelect>
</div>
</template>

<script>
import { get, map, upperFirst } from 'lodash-es';
import { getCardSystemType, prepareCardNumber, prepareCardExpiry } from '@/helpers';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    /**
     * @typedef {{ cardNumber: string, expiryDate: string, cardHolder: string }} Card
     * @type {Card[]}
     */
    cards: {
      default: () => [],
      type: Array,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    required: {
      default: false,
      type: Boolean,
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      focused: false,
      innerValue: this.value || get(this.cards, '0.cardNumber', ''),
    };
  },
  computed: {
    options() {
      return map(this.cards, card => ({
        value: card.cardNumber,
        label: prepareCardNumber(card.cardNumber),
        additional: prepareCardExpiry(card.expiryDate),
        iconComponent: `Icon${upperFirst(getCardSystemType(card.cardNumber))}`,
      }));
    },
  },
  watch: {
    value(value) {
      this.innerValue = value;
    },
  },
};
</script>

<style module lang="scss">
.container {
  display: flex;
  position: relative;
  width: 100%;
  flex-wrap: wrap;
}
.anotherCard {
  display: flex;
  align-items: center;
  color: #fff;
  margin-top: 24px;

  &:hover {
    color: #06eaa7;

    & > svg {
      fill: #06eaa7;
    }
  }

  @include if-rtl {
    margin-right: 20px;
  }
}
.iconPlus {
  @include if-ltr {
    margin-right: 12px;
  }

  @include if-rtl {
    margin-left: 12px;
  }
}
.mastercard {
  position: absolute;
  top: 21px;

  @include if-ltr {
    right: 0;
  }

  @include if-rtl {
    left: 0;
  }
}
</style>
