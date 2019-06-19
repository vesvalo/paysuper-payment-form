<template>
<div :class="$style.layout">
  <div :class="$style.box">
    <div :class="$style.header">
      <div :class="$style.links">
        <span :class="$style.link">Pay Super</span>
        <span :class="$style.link">
          <IconSupport :class="$style.iconSupport" />
        </span>
        <span
          :class="[$style.link, $style.locale, { [$style._opened]: hasLocaleChangerOpened }]"
          @click="hasLocaleChangerOpened = !hasLocaleChangerOpened"
        >
          {{ $i18n.locale }}
        </span>
      </div>
    </div>

    <div :class="$style.content">
      <slot />
      <LocaleCnanger
        v-if="hasLocaleChangerOpened"
        :class="$style.localeChanger"
        @changeLocale="hasLocaleChangerOpened = false"
      />
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import LocaleCnanger from '@/components/LocaleChanger.vue';

export default {
  components: {
    LocaleCnanger,
  },
  data() {
    return {
      hasLocaleChangerOpened: false,
    };
  },
  computed: {
    ...mapState('PaymentForm', ['isFormLoading']),
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.layout}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.link}`]: {
        color: this.$gui.headerTextColor,
      },
      [`.${this.$style.iconSupport}`]: {
        fill: this.$gui.headerTextColor,
      },
      [`.${this.$style.locale}.${this.$style._opened}::after`]: {
        'border-bottom-color': this.$gui.localeChangerModalBoxColor,
      },
    });
  },
};
</script>

<style module lang="scss">
.layout {
  display: flex;
  width: 320px;
  flex-direction: column;
  position: relative;
}
.box {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
  flex-grow: 0;
  padding: 0 20px;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.links {
  display: flex;
  font-size: 12px;
  font-weight: 500;
  line-height: 60px;
  height: 60px;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.link {
  cursor: pointer;

  &:hover {
    color: #00d697;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
}
.locale {
  position: relative;
  text-transform: uppercase;

  &._opened::after {
    position: absolute;
    content: '';
    bottom: 0px;
    border: 8px solid transparent;
    left: 0;
    right: 0;
    margin: 0 auto;
    box-sizing: border-box;
    width: 16px;
  }
}
.iconSupport {
  &:hover {
    fill: #00d697;
  }
}
.content {
  display: flex;
  flex-grow: 1;
  max-height: calc(100% - 60px);
  position: relative;
}
.localeChanger {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 70px);
}
</style>
