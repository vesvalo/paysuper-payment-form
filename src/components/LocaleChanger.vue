<script>
import { includes } from 'lodash-es';

function isRtlLang(lang) {
  const rtlLangs = ['ar'];

  return includes(rtlLangs, lang);
}

export default {
  name: 'locale-changer',
  data() {
    return {
      langs: ['ar', 'en', 'ru'],
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
  },
};
</script>

<template>
  <div class="locale-changer">
    <span
      class="locale-changer__item"
      v-for="lang in langs"
      :key="lang"
      @click="changeLocale(lang)"
    >
      <span
        class="locale-changer__button"
        :class="{'_clickable': $i18n.locale !== lang}"
      >{{lang}}</span>
    </span>
  </div>
</template>

<style lang="scss">
.locale-changer {
  line-height: 16px;

  &__item {
    & + & {
      &::before {
        content: '|';
        color: $ui-color-grey72;
        font-size: 10px;
        margin: 0 5px;
      }
    }
  }

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
</style>
