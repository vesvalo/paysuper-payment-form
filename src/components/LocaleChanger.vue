<template>
<div :class="$style.container">
  <div
    v-for="lang in langs"
    :key="lang"
    :class="$style.item"
    @click="changeLocale(lang.value)"
  >
    <div :class="$style.icon">
      <component :is="option.iconComponent" />
    </div>

    <div :class="[$style.label, { [$style._current]: isCurrentLang(lang.value) }]">
      {{ lang.label }}
    </div>
  </div>
</div>
</template>

<script>
import { includes } from 'lodash-es';

function isRtlLang(lang) {
  const rtlLangs = ['ar'];

  return includes(rtlLangs, lang);
}

export default {
  name: 'localeСhanger',
  data() {
    return {
      langs: [
        { value: 'ar', label: 'العربية' },
        { value: 'en', label: 'English' },
        { value: 'ru', label: 'Русский' },
      ],
    };
  },
  methods: {
    changeLocale(lang) {
      this.$i18n.locale = lang;

      if (isRtlLang(lang)) {
        this.$changeDirection('rtl');
      } else {
        this.$changeDirection('ltr');
      }
    },
    isCurrentLang(lang) {
      return this.$i18n.locale === lang;
    }
  },
};
</script>

<style lang="scss">
.container {
  line-height: 16px;

  &__button {
    font-size: 13px;
    text-decoration: none;
    color: $ui-color-grey58;

    &._clickable {
      color: $ui-color-grey13;
      border-bottom-width: 1px;
      border-bottom-style: dotted;
      cursor: pointer;
    }
  }
}
.item {
  cursor: pointer;
  display: flex;
  height: 40px;
  line-height: 24px;
  margin: 0;
  color: $input-color;
  border-bottom: 1px solid $border-color;
  padding-top: 16px;

  &:hover {
    color: $hover-option-color;
    border-color: $hover-border-color;
  }

  &._empty {
    display: none;
  }
}
.icon {
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
