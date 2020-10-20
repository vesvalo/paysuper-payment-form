<script>
import { includes, get } from 'lodash-es';
import { gtagEvent } from '@/analytics';
import CartSectionListing from '@/components/CartSectionListing.vue';
import PlatformSelect from '@/components/PlatformSelect.vue';

export default {
  name: 'CartSection',

  components: {
    CartSectionListing,
    PlatformSelect,
  },

  props: {
    orderData: {
      required: true,
      type: Object,
    },
    isCartOpened: {
      default: true,
      type: Boolean,
    },
    isPageView: {
      type: Boolean,
      default: false,
    },
    hasPlatformSelect: {
      type: Boolean,
      default: false,
    },
    currentPlatformId: {
      default: '',
      type: String,
    },
    view: {
      type: String,
      default: 'default',
      validator(value) {
        return includes(['default', 'promo'], value);
      },
    },
  },

  computed: {
    items() {
      return this.orderData.items;
    },
    images() {
      if (!this.items) {
        return null;
      }
      const items = this.items.map(
        item => (get(item, 'images[0]') || ''),
      );

      return items.slice(0, 7);
    },
    promoImage() {
      if (!this.items || this.items.length !== 1 || this.view !== 'promo') {
        return '';
      }
      return `url(${this.items[0].promo})`;
    },
    recurringLink() {
      return this.orderData.recurring_management_url || undefined;
    },
    recurringSettings() {
      return this.orderData.recurring_settings;
    },
    recurringPeriod() {
      return get(this.recurringSettings, 'period');
    },
  },

  cssRules() {
    return {
      '.{imageItemInner}.{_noImage}': {
        'border-color': this.$gui.cartStrokeColor,
      },
      '.{imageItemInner}.{_noImage} > svg': {
        fill: this.$gui.cartIconsColor,
      },
      '.{subscription}': {
        color: this.$gui.cartTextColor,
      },
      '.{subscription} > svg': {
        fill: this.$gui.cartTextColor,
      },
      '.{subscription} a': {
        color: this.$gui.cartTextColor,
      },
      '.{subscription} a:hover': {
        color: this.$gui.cartLinkHover,
      },
    };
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
    {
      [$style._promo]: promoImage,
      [$style._closed]: !isCartOpened,
      [$style._isPage]: isPageView,
    }
  ]"
  :style="{ backgroundImage: promoImage }"
>
  <UiScrollbarBox :class="$style.scrollbarBox" :settings="{ suppressScrollX: true }">
    <div :class="$style.innerContainer">
      <div
        v-if="images && !promoImage"
        :class="$style.images"
      >
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
      <CartSectionListing
        :class="[$style.cartSectionListing, { [$style._withoutImages]: !images }]"
        :orderData="orderData"
        :isCartOpened="isCartOpened"
        @clickProduct="clickProduct"
      >
        <PlatformSelect
          v-if="hasPlatformSelect"
          :currentPlatformId="currentPlatformId"
          :platforms="orderData.platforms"
          @change="$emit('changePlatform', $event)"
        />
      </CartSectionListing>

      <div
        v-if="recurringLink || recurringSettings"
        :class="$style.subscription"
      >
        <IconRepeat />
        <div :class="$style.subscriptionInfo">
          <span
            v-if="recurringPeriod"
            v-html="$t('CartSection.subscriptionsSettings', { period: recurringPeriod })"
          ></span>&nbsp;
          <span v-html="$tc('CartSection.subscriptionsLink', {
            n: recurringLink ? 1 : 0,
            link: recurringLink,
          })"></span>
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

  &:not(._isPage) {
    padding: 55px 0;

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

  &._isPage {
    @media screen and (min-width: 640px) {
      padding: 80px 0;
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
}

.innerContainer {
  min-height: 100%;
  padding: 0 20px 30px;
  display: flex;
  flex-direction: column;

  .cartSection._promo & {
    justify-content: flex-end;
  }

  .cartSection._isPage & {
    padding: 0;
  }

  @media screen and (max-width: 639px) {
    .cartSection._closed & {
      padding: 0;
    }
  }
}

.cartSectionListing {
  order: 2;
  width: 100%;
}

.images {
  order: 1;
  display: flex;
  flex-wrap: wrap;
  padding-top: 5px;
  margin: -5px -5px 9px -5px;
}

.imageItem {
  box-sizing: border-box;
  flex-grow: 1;
  flex-basis: 20%;
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

.subscription {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  margin-top: 18px;
  order: 3;
  font-size: 10px;
  line-height: 14px;

  a {
    transition: color 0.2s ease-out;
  }

  & > svg {
    flex-basis: 12px;
  }
}
.subscriptionInfo {
  margin-left: 6px;
}
</style>
