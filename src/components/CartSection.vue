<script>
import { includes, get } from 'lodash-es';
import { gtagEvent } from '@/analytics';

export default {
  name: 'CartSection',

  props: {
    orderData: {
      required: true,
      type: Object,
    },
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
    items() {
      return this.orderData.items;
    },
    images() {
      if (!this.items) {
        return null;
      }
      return this.items.slice(0, 7).map(
        item => (get(item, 'images[0]') || ''),
      );
    },
    promoImage() {
      if (!this.items || this.items.length !== 1 || this.view !== 'promo') {
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
      [`.${this.$style.imageItemInner}.${this.$style._noImage}`]: {
        'border-color': this.$gui.cartTextColor,
      },
      [`.${this.$style.imageItemInner}.${this.$style._noImage} > svg`]: {
        fill: this.$gui.cartTextColor,
      },
      [`.${this.$style.item}.${this.$style._total}`]: {
        color: this.$gui.cartTotalTextColor,
      },
      [`.${this.$style.oldPrice}`]: {
        color: this.$gui.cartOldPriceColor,
      },
      [`.${this.$style.totals}`]: {
        'border-top': `1px solid ${this.$gui.cartTotalStrokeColor}`,
      },
    });
  },

  methods: {
    clickProduct(index) {
      gtagEvent('select_content', {
        content_type: 'product',
        items: [{
          id: this.items[index].id,
          name: this.items[index].name,
          list_name: 'Cart items',
          list_position: index + 1,
          price: `${this.items[index].amount}`,
          quantity: 1,
        }],
      });
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
      <div v-if="images && !promoImage" :class="$style.images">
        <div
          v-for="(img, index) in images"
          :class="[$style.imageItem, $style[`_count-${images.length}`]]"
          :key="index"
          @click="clickProduct(index)"
        >
          <div
            :class="[$style.imageItemInner, { [$style._noImage]: !img }]"
            :style="{ backgroundImage: img ? `url(${img})` : undefined }"
          >
            <IconNoImage v-if="!img" />
          </div>
        </div>
      </div>
      <div :class="$style.listing">
        <div :class="$style.items">
          <template v-if="items">
            <div
              v-for="(item, index) in items"
              :class="$style.item"
              :key="item.id"
            >
              <span
                :class="[$style.itemCell, $style._title]"
                @click="clickProduct(index)"
              >
                {{item.name}}
              </span>
              <span :class="[$style.itemCell, $style._price]">
                <span :class="$style.oldPrice" v-if="item.discount">
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
              {{$t('CartSection.voluntaryAmount')}}
            </span>
            <span :class="[$style.itemCell, $style._price]">
              {{ $getPrice(orderData.amount, orderData.currency) }}
            </span>
          </div>
        </div>
      </div>
      <div :class="$style.totals">
        <div :class="$style.items">
          <template v-if="orderData.vat">
            <div :class="[$style.item, $style.subtotal]">
              <span :class="[$style.itemCell, $style._title]">{{$t('CartSection.subtotal')}}</span>
              <span :class="[$style.itemCell, $style._price]">
                {{ $getPrice(orderData.amount, orderData.currency) }}
              </span>
            </div>
            <div :class="[$style.item, $style.taxes]">
              <span :class="[$style.itemCell, $style._title]">{{$t('CartSection.taxes')}}</span>
              <span :class="[$style.itemCell, $style._price]">
                {{ $getPrice(orderData.vat, orderData.currency) }}
              </span>
            </div>
          </template>
          <div :class="[$style.item, $style._total]">
            <span :class="[$style.itemCell, $style._title]">{{$t('CartSection.total')}}</span>
            <span :class="[$style.itemCell, $style._price]">
              {{ $getPrice(orderData.total_amount, orderData.currency) }}
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

  @media screen and (max-width: 639px) {
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

  @media screen and (max-width: 639px) {
    .cartSection._closed & {
      padding: 0;
    }
  }
}

.images {
  display: flex;
  flex-wrap: wrap;
  padding-top: 5px;
  margin: -5px -5px 9px -5px;
}

.listing {
  position: relative;
  z-index: 1;
}

.imageItem {
  flex-grow: 1;
  flex-basis: 20%;
  box-sizing: border-box;
  margin: 5px;

  &._count-5 {
    &:nth-child(1),
    &:nth-child(2) {
      flex-basis: 40%;
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
  position: relative;
  box-sizing: border-box;

  .imageItem._count-1 & {
    padding-top: 67%;
  }

  &._noImage {
    border: 1px solid;
  }

  & > svg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 40%;
    height: 40%;
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

.totals {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  padding: 12px 0 0;

  @media screen and (max-width: 639px) {
    .cartSection._closed & {
      margin-top: 0;
    }
  }
}
</style>
