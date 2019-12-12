<script>
import { includes } from 'lodash-es';
import { gtagEvent } from '@/analytics';

export default {
  name: 'SavedCardToPlainFieldsSwitch',

  model: {
    prop: 'nowUsing',
    event: 'change',
  },

  props: {
    nowUsing: {
      type: String,
      required: true,
      validator(value) {
        return includes(['saved', 'manual'], value);
      },
    },
  },

  cssRules() {
    return {
      '.{savedCardToPlainFieldsSwitch}': {
        color: this.$gui.savedCardsSwitchColor,
      },
      '.{savedCardToPlainFieldsSwitch} > svg': {
        fill: this.$gui.savedCardsSwitchColor,
      },
    };
  },

  methods: {
    emitChange() {
      const value = this.nowUsing === 'saved' ? 'manual' : 'saved';
      if (value === 'saved') {
        gtagEvent('useSavedBankCards', { event_category: 'userAction' });
      } else {
        gtagEvent('useManualBankCardsInput', { event_category: 'userAction' });
      }
      this.$emit('change', value);
    },
  },
};
</script>

<template>
<div
  :class="$style.savedCardToPlainFieldsSwitch"
  @click="emitChange"
>
  <template v-if="nowUsing === 'saved'">
    {{ $t('SavedCardToPlainFieldsSwitch.anotherWayToPay') }}
  </template>
  <template v-if="nowUsing === 'manual'">
    {{ $t('SavedCardToPlainFieldsSwitch.payWithSavedCards') }}
  </template>
  <IconThinArrowRight />
</div>
</template>

<style lang="scss" module>
.savedCardToPlainFieldsSwitch {
  text-transform: uppercase;
  font-size: 11px;
  line-height: 18px;
  font-weight: 500;
  cursor: pointer;

  & > svg {
    @include if-rtl {
      transform: rotate(180deg);
    }
  }
}
</style>
