<script>
import { includes } from 'lodash-es';

export default {
  name: 'CartSection',

  props: {
    items: {
      type: Array,
      required: true,
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
      tax: 2,
      currency: '$',
    };
  },

  computed: {
    images() {
      return this.items.slice(0, 7).map(item => item.img);
    },

    promoImage() {
      if (this.items.length !== 1 || this.view !== 'promo') {
        return '';
      }
      return `url(${this.items[0].promo})`;
    },

    subtotal() {
      return this.items.map(item => item.price.value).reduce((a, b) => a + b);
    },

    total() {
      return this.subtotal + this.tax;
    },
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
  :class="[$style.cartSection, {[$style._promo]: promoImage}]"
  :style="{backgroundImage: promoImage}"
>
  <UiScrollbarBox :class="$style.scrollbarBox">
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
            v-for="(item, index) in items"
            :class="$style.item"
            :key="index"
          >
            <span :class="[$style.itemCell, $style._title]">{{item.title}}</span>
            <span :class="[$style.itemCell, $style._price]">
              <span :class="$style.oldPrice" v-if="item.price.discount">
                {{item.price.currency}}{{item.price.value.toFixed(2)}}</span>
              {{item.price.currency}}{{getItemPrice(item.price)}}
            </span>
          </div>
        </div>
      </div>
      <div :class="$style.totals">
        <div :class="$style.items">
          <div :class="$style.item">
            <span :class="[$style.itemCell, $style._title]">{{$t('subtotal')}}</span>
            <span :class="[$style.itemCell, $style._price]">
              {{currency}}{{subtotal.toFixed(2)}}
            </span>
          </div>
          <div :class="$style.item">
            <span :class="[$style.itemCell, $style._title]">{{$t('taxes')}} Russia</span>
            <span :class="[$style.itemCell, $style._price]">
              {{currency}}{{tax.toFixed(2)}}
            </span>
          </div>
          <div :class="[$style.item, $style._total]">
            <span :class="[$style.itemCell, $style._title]">{{$t('total')}}</span>
            <span :class="[$style.itemCell, $style._price]">
              {{currency}}{{total.toFixed(2)}}
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
  padding: 58px 0 58px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

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
}

.scrollbarBox {
  min-height: 100%;
  width: 100%;
}

.innerContainer {
  min-height: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;

  .cartSection._promo & {
    justify-content: flex-end;
  }
}

.images {
  display: flex;
  flex-wrap: wrap;
  margin: -5px;
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
    color: #06eaa7;
    font-weight: bold;
  }
}

.itemCell {
  padding: 6px 0;
  display: table-cell;

  &._title {
    width: 90%;
    padding-right: 10px;
  }

  &._price {
    text-align: right;
    white-space: nowrap;
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
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
</style>

<i18n>
{
  "en": {
    "subtotal": "Subtotal",
    "taxes": "Taxes",
    "total": "Total"
  }
}
</i18n>
