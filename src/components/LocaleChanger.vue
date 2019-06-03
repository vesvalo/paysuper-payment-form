<template>
<div :class="[$style.container, $style[`_${layout}`]]">
  <UiScrollbarBox :class="$style.scrollbar">
    <div :class="$style.inner">
      <div
        v-for="(locale, localeCode) in locales"
        :key="localeCode"
        :class="[$style.item, { [$style._current]: $i18n.locale === localeCode }]"
        @click="changeLocale(localeCode)"
      >
        <div :class="$style.icon">
          <component :is="iconLang(localeCode)" />
        </div>

        <div :class="$style.label">
          {{ locale.label }}
        </div>
      </div>
    </div>
  </UiScrollbarBox>
</div>
</template>

<script>
import { includes, upperFirst } from 'lodash-es';
import locales from '@/locales/scheme';

export default {
  name: 'localeСhanger',
  props: {
    layout: {
      type: String,
      default: 'modal',
      validator(value) {
        return includes(['modal', 'page'], value);
      },
    },
  },
  data() {
    return {
      locales,
    };
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;

      if (this.locales[locale].rtl) {
        this.$changeDirection('rtl');
      } else {
        this.$changeDirection('ltr');
      }

      this.$emit('changeLocale', locale);
    },
    iconLang(locale) {
      return `IconLang${upperFirst(locale)}`;
    },
  },
};
</script>

<style module lang="scss">
@import '@/assets/styles/directional.scss';

$color: #202226;
$box-color: #f3f3f3;
$border-color: rgba(#C2C2C4, 0.5);
$hover-border-color: rgba(#C2C2C4, 0.8);
$hover-option-color: #06eaa7;

.container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px 20px 10px 40px;
  overflow: hidden;

  &._modal {
    background-color: $box-color;
    color: $color;
  }
}
.inner {
  padding-right: 20px;
}
.scrollbar {
  height: 100%;
}
.item {
  cursor: pointer;
  display: flex;
  height: 40px;
  line-height: 24px;
  margin: 0;
  border-bottom: 1px solid $border-color;
  padding-top: 16px;

  &:hover {
    color: $hover-option-color;
    border-color: $hover-border-color;
  }

  &._current {
    color: $hover-option-color;
  }

  &._empty {
    display: none;
  }
}
.icon {
  border-radius: 3px;
  overflow: hidden;
  height: 18px;

  @include if-ltr {
    margin-right: 12px;
  }

  @include if-rtl {
    margin-left: 12px;
  }
}
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
