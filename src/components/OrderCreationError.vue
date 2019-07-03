<script>
import { includes } from 'lodash-es';
import IconTotemFail from '@/components/IconTotemFail.vue';

export default {
  name: 'OrderCreationError',

  props: {
    type: {
      required: true,
      type: String,
      validator(value) {
        return includes(['unknownError', 'customError'], value);
      },
    },

    message: {
      type: String,
    },
  },

  components: {
    IconTotemFail,
  },

  mounted() {
    this.$addCssRules({
      [`.${this.$style.orderCreationError}`]: {
        'background-color': this.$gui.cartBackgroundColor,
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
        <IconTotemFail/>
      </div>
      <div>
        <h2
          :class="$style.titleMain"
          v-html="$t('OrderCreationError.title')"
        >
        </h2>
      </div>
      <div
        :class="$style.description"
        v-html="type === 'unknownError' ? $t('OrderCreationError.unknownError') : message"
      >
      </div>
    </div>
    <div :class="$style.footer">
       <UiButton
        :class="$style.button"
        :hasBorderRadius="false"
        @click="$emit('tryAgain')"
       >{{$t('OrderCreationError.tryAgain')}}</UiButton>
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
  position: relative;
  z-index: 1000;

  &._layout-page {
  }
}

.content {
  padding: 10px 40px 40px;
  width: 650px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icon {
  margin-bottom: 30px;
}

.titleMain {
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 40px;
}

.description {
  color: #f3da58;
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
