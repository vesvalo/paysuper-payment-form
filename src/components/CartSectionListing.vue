<script>

export default {
  name: 'CartSectionListing',

  props: {
    orderData: {
      required: true,
      type: Object,
    },
    isCartOpened: {
      default: true,
      type: Boolean,
    },
  },

  computed: {
    vatPercentageText() {
      const value = Number(this.orderData.vat_rate * 100).toFixed(2);
      return `${value}%`;
    },
    vatCommentText() {
      const commentVarName = this.orderData.vat_payer === 'seller' ? 'vatFromSeller' : 'vatFromBuyer';
      return this.$t(`CartSection.${commentVarName}`);
    },
    isExplicitCharge() {
      if (
        this.orderData.total_amount !== this.orderData.charge_amount
        || this.orderData.currency !== this.orderData.charge_currency
      ) {
        return true;
      }
      return false;
    },
    totalAmount() {
      return this.$getPrice(this.orderData.total_amount, this.orderData.currency);
    },
    chargeAmount() {
      return this.$getPrice(this.orderData.charge_amount, this.orderData.charge_currency);
    },
  },

  cssRules() {
    return {
      '.{item}': {
        color: this.$gui.cartTextColor,
      },
      [`
        .{item}.{_total},
        .{item}.{_subtotal},
        .{item}.{_taxes}
      `]: {
        color: this.$gui.cartAccentColor,
      },
      '.{item}.{_common} .{itemCell}.{_price}, .{specialPrice}': {
        color: this.$gui.cartPriceColor,
      },
      '.{titleNotice}': {
        color: this.$gui.cartTextColor,
      },
      '.{oldPrice}': {
        color: this.$gui.cartOldPriceColor,
      },
      '.{totals}': {
        'border-top': `1px solid ${this.$gui.cartStrokeColor}`,
      },
      '.{totalNotice}': {
        color: this.$gui.cartTotalNoticeColor,
      },
      '.{totalNotice} > svg': {
        fill: this.$gui.cartTotalNoticeColor,
      },
    };
  },
};
</script>

<template>
<div
  :class="[
    $style.cartSectionListing,
    { [$style._closed]: !isCartOpened }
  ]"
>
  <div :class="[$style.items, $style.hidden]">
    <template v-if="orderData.items">
      <div
        v-for="(item, index) in orderData.items"
        :class="[$style.item, $style._common]"
        :key="item.id"
      >
        <span
          :class="[$style.itemCell, $style._title]"
          @click="$emit('clickProduct', index)"
        >
          {{ item.name }}
        </span>
        <span
          :class="[$style.itemCell, $style._price]"
          :title="$getPrice(item.amount, item.currency)"
        >
          <span v-if="item.discount" :class="$style.oldPrice">
            {{ $getPrice(item.price.value, item.price.currency) }}
          </span>
          {{ $getPrice(item.amount, item.currency) }}
        </span>
      </div>
    </template>
    <div
      v-else
      :class="$style.item"
    >
      <span :class="[$style.itemCell, $style._title]">
        {{ $t('CartSection.voluntaryAmount') }}
      </span>
      <span
        :class="[$style.itemCell, $style._price]"
        :title="$getPrice(orderData.amount, orderData.currency)"
      >
        {{ $getPrice(orderData.amount, orderData.currency) }}
      </span>
    </div>
  </div>
  <div
    v-if="isExplicitCharge || orderData.vat"
    :class="[$style.totals, $style._vat]"
  >
    <div :class="$style.items">
      <div :class="[$style.item, $style._subtotal, $style.hidden]">
        <span :class="[$style.itemCell, $style._title]">
          {{ $t('CartSection.orderSummary') }}
        </span>
        <span
          :class="[$style.itemCell, $style._price]"
          :title="$getPrice(orderData.amount, orderData.currency)"
        >
          {{ $getPrice(orderData.amount, orderData.currency) }}
        </span>
      </div>
      <div
        v-if="orderData.vat"
        :class="[$style.item, $style._taxes, $style.hidden]"
      >
        <span :class="[$style.itemCell, $style._title]">
          {{ $t('CartSection.taxes') }}
          <span
            v-if="$root.localeRedrawToggler"
            :class="$style.titleNotice"
          >
            ({{ vatCommentText }} {{vatPercentageText}})
          </span>
        </span>
        <span
          :class="[$style.itemCell, $style._price]"
          :title="$getPrice(orderData.vat, orderData.currency)"
        >
          {{ $getPrice(orderData.vat, orderData.currency) }}
        </span>
      </div>
      <div
        v-if="isExplicitCharge"
        :class="[$style.item, $style._subtotal, $style.hidden]"
      >
        <span :class="[$style.itemCell, $style._title]">
          {{ $t('CartSection.subtotal') }}
        </span>
        <span
          :class="[$style.itemCell, $style._price]"
          :title="`${totalAmount} = ${chargeAmount}`"
        >
          <span :class="$style.specialPrice">
            {{ totalAmount }} =
          </span>
          {{ chargeAmount }}
        </span>
      </div>
    </div>
  </div>
  <div :class="$style.totals">
    <div :class="$style.items">
      <div :class="[$style.item, $style._total]">
        <span :class="[$style.itemCell, $style._title]">
          {{ $t('CartSection.total') }}
        </span>
        <span
          :class="[$style.itemCell, $style._price]"
          :title="chargeAmount"
        >
          {{ chargeAmount }}
        </span>
      </div>
    </div>
  </div>

  <div :class="$style.totalNotice">
    <IconInfoStroke />
    <template v-if="isExplicitCharge && orderData.vat">
      {{ $t('CartSection.totalNoticeVat') }} {{ vatPercentageText }}
      {{ $getPrice(orderData.vat_in_charge_currency, orderData.charge_currency) }}.
    </template>
    <span v-html="$t('CartSection.totalNotice')"></span>
  </div>

  <slot />
</div>
</template>
<style lang="scss" module>
.cartSectionListing {
  position: relative;
  z-index: 1;

  @media screen and (max-width: 639px) {
    &._closed .hidden {
      display: none;
    }
  }
}
.items {
  display: table;
  width: 100%;
  table-layout: fixed;
}
.item {
  display: table-row;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  word-break: break-word;

  &._total {
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
  }

  &._common,
  &._subtotal,
  &._taxes {
    opacity: 1;
  }
}
.itemCell {
  padding: 4px 0;
  display: table-cell;

  &._title {
    width: 60%;
    padding-right: 10px;

    @include if-rtl {
      padding-right: 0;
      padding-left: 10px;
    }
  }

  &._price {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include if-ltr {
      text-align: right;
    }

    @include if-rtl {
      text-align: left;
    }
  }
}
.specialPrice,
.titleNotice {
  opacity: 1;
}
.oldPrice {
  text-decoration: line-through;
  padding-right: 6px;
  font-weight: 100;
}
.totals {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  padding: 12px 0 0;

  @media screen and (max-width: 639px) {
    .cartSectionListing._closed & {
      margin-top: 0;
    }
    .cartSectionListing._closed &._vat {
      display: none;
    }
  }
}

.totalNotice {
  position: relative;
  font-size: 9px;
  line-height: 13px;
  padding-left: 13px;
  margin-top: 6px;

  & > svg {
    position: absolute;
    left: 1px;
    top: 1px;
  }

  @include if-rtl {
    padding-left: 0;
    padding-right: 13px;

    & > svg {
      left: auto;
      right: 1px;
    }
  }
}
</style>
