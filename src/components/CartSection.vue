<script>
import { includes } from 'lodash-es';
import {
  mapState,
} from 'vuex';

export default {
  name: 'CartSection',

  props: {
    isCartOpened: {
      default: true,
      type: Boolean,
    },
    layout: {
      type: String,
      default: 'modal',
      validator(value) {
        return includes(['modal', 'page'], value);
      },
    },

    view: {
      type: String,
      default: 'default',
      validator(value) {
        return includes(['default', 'promo'], value);
      },
    },
  },

  data() {
    return {
      tax: 0,
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderData',
    ]),
    items() {
      return this.orderData.items || [{
        name: this.$t('CartSection.voluntaryAmount'),
        amount: this.orderData.amount,
        currency: this.orderData.currency,
      }];
    },
    images() {
      return this.items.slice(0, 7).map(
        item => (item.images ? item.images[0] : 'https://ci-print.ru/assets/images/blog-1.jpg'),
      );
    },
    promoImage() {
      if (this.items.length !== 1 || this.view !== 'promo') {
        return '';
      }
      return `url(${this.items[0].promo})`;
    },
  },

  mounted() {
    this.$addCssRules({
      [`.${this.$style.item}`]: {
        color: this.$gui.cartTextColor,
      },
      [`.${this.$style.item}.${this.$style._total}`]: {
        color: this.$gui.cartTotalTextColor,
      },
      [`.${this.$style.totals}`]: {
        'border-top': `1px solid ${this.$gui.cartTotalStrokeColor}`,
      },
    });
  },

  methods: {
    getItemPrice(price) {
      if (!price.discount) {
        return price.value.toFixed(2);
      }

      const discountValue = price.value / 100 * price.discount;
      return (price.value - discountValue).toFixed(2);
    },
  },
};
</script>

<template>
<div
  :class="[
    $style.cartSection,
    $style[`_layout-${layout}`],
    {[$style._promo]: promoImage, [$style._closed]: !isCartOpened}
  ]"
  :style="{backgroundImage: promoImage}"
>
  <UiScrollbarBox :class="$style.scrollbarBox" :settings="{suppressScrollX: true}">
    <div :class="$style.innerContainer">
      <div v-if="!promoImage" :class="$style.images">
        <div
          v-for="(img, index) in images"
          :class="[$style.imageItem, $style[`_count-${images.length}`]]"
          :key="index"
        >
          <div
            :class="$style.imageItemInner"
            :style="{backgroundImage: `url(${img})`}"
          ></div>
        </div>
      </div>
      <div :class="$style.listing">
        <div :class="$style.items">
          <div
            v-for="item in items"
            :class="$style.item"
            :key="item.id"
          >
            <span :class="[$style.itemCell, $style._title]">{{item.name}}</span>
            <span :class="[$style.itemCell, $style._price]">
              <span :class="$style.oldPrice" v-if="item.discount">
                {{item.price.currency}}{{item.price.value.toFixed(2)}}</span>
              {{item.amount}} {{item.currency}}
            </span>
          </div>
        </div>
      </div>
      <div :class="$style.totals">
        <div :class="$style.items">
          <div :class="[$style.item, $style.subtotal]">
            <span :class="[$style.itemCell, $style._title]">{{$t('CartSection.subtotal')}}</span>
            <span :class="[$style.itemCell, $style._price]">
              {{orderData.amount.toFixed(2)}} {{orderData.currency}}
            </span>
          </div>
          <div :class="[$style.item, $style.taxes]">
            <span :class="[$style.itemCell, $style._title]">{{$t('CartSection.taxes')}}</span>
            <span :class="[$style.itemCell, $style._price]">
              {{orderData.vat.toFixed(2)}} {{orderData.currency}}
            </span>
          </div>
          <div :class="[$style.item, $style._total]">
            <span :class="[$style.itemCell, $style._title]">{{$t('CartSection.total')}}</span>
            <span :class="[$style.itemCell, $style._price]">
              {{orderData.total_amount.toFixed(2)}} {{orderData.currency}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </UiScrollbarBox>
</div>
</template>

<style lang="scss" module>
.cartSection {
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;

  &._layout-modal {
    padding: 40px 0;
  }

  &._layout-page {
    @media screen and (min-width: 640px) {
      padding: 80px 0;
    }
  }

  &._promo {
    background-size: cover;
    background-position: center;

    &::before,
    &::after {
      content: '';
      position: absolute;
      right: 0;
      left: 0;
    }
    &::before {
      top: 0;
      height: 20%;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.7) 100%
      );
    }
    &::after {
      bottom: 0;
      height: 70%;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.8) 100%
      );
    }
  }

  @media screen and (max-width: 640px) {
    &._closed {
      padding: 0 0 10px;

      .listing,
      .images,
      .subtotal,
      .taxes {
        display: none;
      }
    }
  }
}

.scrollbarBox {
  min-height: 100%;
  width: 100%;

  .cartSection._layout-modal & {
    padding: 20px 0 30px;
  }
}

.innerContainer {
  min-height: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;

  .cartSection._promo & {
    justify-content: flex-end;
  }

  .cartSection._layout-page & {
    padding: 0;
  }

  @media screen and (max-width: 640px) {
    .cartSection._closed & {
      padding: 0;
    }
  }
}

.images {
  display: flex;
  flex-wrap: wrap;
  margin: -5px;
  padding-top: 5px;
}

.imageItem {
  flex-grow: 1;
  flex-basis: 20%;
  box-sizing: border-box;
  margin: 5px;

  &._count-5 {
    &:nth-child(1),
    &:nth-child(2) {
      flex-basis: 35%;
    }
  }

  &._count-6,
  &._count-7 {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      flex-basis: 29%;
    }
  }
}

.imageItemInner {
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 5px;

  .imageItem._count-1 & {
    padding-top: 67%;
  }
}

.items {
  display: table;
  width: 100%;
}

.item {
  display: table-row;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.7);

  &._total {
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
  }
}

.itemCell {
  padding: 6px 0;
  display: table-cell;

  &._title {
    width: 74%;
    padding-right: 10px;

    @include if-rtl {
      padding-right: 0;
      padding-left: 10px;
    }
  }

  &._price {
    white-space: nowrap;

    @include if-ltr {
      text-align: right;
    }

    @include if-rtl {
      text-align: left;
    }
  }
}

.oldPrice {
  color: rgba(255, 255, 255, 0.3);
  text-decoration: line-through;
  padding-right: 6px;
  font-weight: 100;
}

.listing {
  margin-top: 14px;
  position: relative;
  z-index: 1;
}

.totals {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  padding: 12px 0 0;

  @media screen and (max-width: 640px) {
    .cartSection._closed & {
      margin-top: 0;
    }
  }
}
</style>
