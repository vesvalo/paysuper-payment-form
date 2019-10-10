<script>
import { mapState } from 'vuex';
import { gtagEvent } from '@/analytics';

export default {
  name: 'VerticalCartSection',
  data() {
    return {
      tax: 0,
    };
  },
  computed: {
    ...mapState('PaymentForm', ['orderData']),
    items() {
      return this.orderData.items;
    },
    images() {
      if (!this.items) {
        return null;
      }
      return this.items.map(
        item => (item.images ? item.images[0] : 'https://ci-print.ru/assets/images/blog-1.jpg'),
      );
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
<div :class="$style.cartSection">
  <UiScrollbarBox :class="$style.scrollbarBox" :settings="{ suppressScrollX: true }">
    <div :class="$style.innerContainer">
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
                {{ item.name }}
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
              {{ $t('CartSection.voluntaryAmount') }}
            </span>
            <span :class="[$style.itemCell, $style._price]">
              {{ $getPrice(orderData.amount, orderData.currency) }}
            </span>
          </div>
        </div>
        <div :class="$style.totals">
          <div :class="$style.items">
            <template v-if="orderData.vat">
              <div :class="[$style.item, $style.subtotal]">
                <span :class="[$style.itemCell, $style._title]">
                  {{ $t('CartSection.subtotal') }}
                </span>
                <span :class="[$style.itemCell, $style._price]">
                  {{ $getPrice(orderData.amount, orderData.currency) }}
                </span>
              </div>
              <div :class="[$style.item, $style.taxes]">
                <span :class="[$style.itemCell, $style._title]">
                  {{ $t('CartSection.taxes') }}
                </span>
                <span :class="[$style.itemCell, $style._price]">
                  {{ $getPrice(orderData.vat, orderData.currency) }}
                </span>
              </div>
            </template>
            <div :class="[$style.item, $style._total]">
              <span :class="[$style.itemCell, $style._title]">
                {{ $t('CartSection.total') }}
              </span>
              <span :class="[$style.itemCell, $style._price]">
                {{ $getPrice(orderData.total_amount, orderData.currency) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="images" :class="$style.images">
        <div
          v-for="(img, index) in images"
          :class="[$style.imageItem, $style[`_count-${images.length}`]]"
          :key="index"
          @click="clickProduct(index)"
        >
          <div
            :class="$style.imageItemInner"
            :style="{ backgroundImage: `url(${img})` }"
          ></div>
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
  padding-bottom: 12px;
}
.scrollbarBox {
  min-height: 100%;
  width: 100%;
}
.innerContainer {
  min-height: 100%;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
}
.images {
  display: flex;
  flex-wrap: wrap;
  width: 86px;
  justify-content: space-between;
  align-content: flex-start;
}
.imageItem {
  flex-basis: calc(50% - 3px);
  height: 40px;
  box-sizing: border-box;
  margin-bottom: 6px;

  &._count-1 {
    flex-basis: 100%;
    height: 86px;
  }
}
.imageItemInner {
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
}
.listing {
  position: relative;
  z-index: 1;
  width: calc(100% - 106px);
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
  padding: 4px 0;
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
}
</style>
