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
};
</script>

<template>
<transition
  appear
  :enter-class="$style.enter"
  :enter-active-class="$style.enterActive"
  :enter-to-class="$style.enterTo"
  :leave-class="$style.leave"
  :leave-active-class="$style.leaveActive"
  :leave-to-class="$style.leaveTo"
>
  <div :class="$style.actionProcessing">
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
</transition>
</template>

<style lang="scss" module>
.actionProcessing {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.content {
  padding: 10px 40px 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.icon {
}

.titleMain {
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 18px;
}

.description {
  color: #f3da58;
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.footer {
}

.button {
  width: 100%;
}

.enter,
.leaveTo {
  opacity: 0;
}
.enterTo,
.leave {
  opacity: 1;
}
.enterActive,
.leaveActive {
  transition: opacity 0.15s ease-in-out;
}
</style>
