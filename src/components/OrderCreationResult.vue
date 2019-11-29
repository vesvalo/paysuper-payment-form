<script>
import { includes } from 'lodash-es';
import IconTotemFail from '@/components/IconTotemFail.vue';
import getErrorCodeTranslation from '@/helpers/getErrorCodeTranslation';

export default {
  name: 'OrderCreationResult',

  components: {
    IconTotemFail,
  },

  props: {
    type: {
      required: true,
      type: String,
      validator(value) {
        return includes(['unknownError', 'customError', 'alreadyProcessed'], value);
      },
    },

    receiptUrl: {
      type: String,
    },

    isModal: {
      type: Boolean,
      default: false,
    },

    code: {
      type: String,
    },
  },

  computed: {
    message() {
      return getErrorCodeTranslation(this.code, this.$i18n.locale);
    },
    titleMain() {
      if (this.type === 'alreadyProcessed') {
        return this.$t('OrderCreationResult.alreadyCompletedTitle');
      }
      return this.$t('OrderCreationResult.title');
    },
    description() {
      if (this.type === 'alreadyProcessed') {
        return '';
      }

      if (this.type === 'unknownError') {
        return this.$t('OrderCreationResult.unknownError');
      }

      return this.message;
    },
  },

  created() {
    this.$addCssRules({
      [`.${this.$style.orderCreationError}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.titleMain}`]: {
        color: this.$gui.warningTitleColor,
      },
      [`.${this.$style.description}`]: {
        color: this.$gui.warningTextColor,
      },
    });
  },
};
</script>

<template>
<UiTransitionFade>
  <div :class="$style.orderCreationError">
    <div :class="$style.content">
      <div :class="$style.icon">
        <IconTotemSuccess v-if="type === 'alreadyProcessed'" />
        <IconTotemFail v-else/>
      </div>
      <div>
        <h2
          :class="$style.titleMain"
          v-html="titleMain"
        >
        </h2>
      </div>
      <div
        v-if="description"
        :class="$style.description"
        v-html="description"
      >
      </div>
    </div>
    <div :class="$style.footer">
      <a
        v-if="type === 'alreadyProcessed'"
        :href="receiptUrl"
        target="_blank"
      >
        <UiButton
          :class="$style.button"
          :hasBorderRadius="false"
        >
          {{ $t('OrderCreationResult.openReceipt') }}
        </UiButton>
      </a>
      <UiButton
        v-else
        :class="$style.button"
        :hasBorderRadius="false"
        @click="$emit('tryAgain')"
      >
        {{$t('OrderCreationResult.tryAgain')}}
      </UiButton>
    </div>
  </div>
</UiTransitionFade>
</template>

<style lang="scss" module>
.orderCreationError {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  z-index: 100;
  position: absolute;
  left: 0;
  top: 0;
}

.content {
  padding: 10px 40px 10px;
  width: 100%;
  max-width: 650px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icon {
  margin-bottom: 30px;
}

.titleMain {
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 40px;
}

.description {
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.footer {
  width: 100%;
}

.button {
  width: 100%;
}
</style>
