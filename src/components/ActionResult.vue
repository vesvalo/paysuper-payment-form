<script>
import IconTotemFail from '@/components/IconTotemFail.vue';
import IconTotemSuccess from '@/components/IconTotemSuccess.vue';
import IconCardCracked from '@/components/IconCardCracked.vue';
import IconCardFail from '@/components/IconCardFail.vue';
import IconCardSuccess from '@/components/IconCardSuccess.vue';
import IconLetsPlay from '@/components/IconLetsPlay.vue';
import UiTextField from '@/components/UiTextField.vue';
import { includes } from 'lodash-es';

export default {
  name: 'ActionResult',

  components: {
    IconTotemFail,
    IconTotemSuccess,
    IconCardCracked,
    IconCardFail,
    IconCardSuccess,
    IconLetsPlay,
    UiTextField,
  },

  props: {
    type: {
      required: true,
      type: String,
      validator(value) {
        return includes(['customError'], value);
      },
    },

    message: {
      type: String,
    },

    step: {
      type: String,
      default: 'initial',
    },

    code: {
      type: String,
      default: '88456-89735-87635-98372',
    },
  },

  data() {
    return {
      email: '',
      types: {
        // 1. Охуевший тотем - нахватка средств или специальная ошибка (+ жёлтый текст и опции)
        // 2. Карта с крестиком - неведомая ошибка
        // 3. Разбитая карта - общая ошибка с текстом
        customError: {
          title: this.$t('ActionResult.error.title'),
          subtitle: this.$t('ActionResult.error.subtitle'),
          iconComponent: 'IconCardFail',
          description: this.$t('ActionResult.error.description'),
        },
        // declined: {
        //   title: this.$t('ActionResult.declined.title'),
        //   subtitle: this.$t('ActionResult.declined.subtitle'),
        //   iconComponent: {
        //     card: 'IconCardCracked',
        //     other: 'IconTotemFail',
        //   },
        //   description: this.$t('ActionResult.declined.description'),
        // },
        // error: {
        //   title: this.$t('ActionResult.error.title'),
        //   subtitle: this.$t('ActionResult.error.subtitle'),
        //   iconComponent: {
        //     card: 'IconCardFail',
        //     other: 'IconTotemFail',
        //   },
        //   description: this.$t('ActionResult.error.description'),
        // },
        // success: {
        //   title: this.$t('ActionResult.success.title'),
        //   iconComponent: {
        //     card: 'IconCardSuccess',
        //     other: 'IconTotemSuccess',
        //   },
        // },
      },
    };
  },
};
</script>

<template>
  <div :class="$style.actionResult">
    <div>
      <h2 :class="$style.titleMain">{{types[type].title}}</h2>
      <div v-if="type === 'success'">
        <p :class="$style.titleSubSlave">
          {{$t('ActionResult.success.titleSubSlave')}}
        </p>
        <p :class="$style.code">{{code}}</p>
      </div>
      <p
        :class="$style.titleSub"
        v-else
      >{{types[type].subtitle}}</p>
    </div>
    <div :class="$style.icon">
      <component :is="types[type].iconComponent" />
    </div>
    <div v-if="type === 'success'">
      <template v-if="step === 'initial'">
        <p :class="$style.descriptionSlave">
          {{$t('ActionResult.success.descriptionSlaveInitial')}}
        </p>
        <UiTextField
          v-model="email"
          :label="$t('ActionResult.success.email')"
          @input="$emit('emailChange', $event)"
        />
      </template>
      <template v-if="step === 'final' && email">
        <p
          :class="$style.descriptionSlave"
          v-html="$t('ActionResult.success.descriptionSlaveFinal')"
        >
        </p>
        <p :class="$style.email">{{email}}</p>
      </template>
    </div>
    <div
      :class="$style.description"
      v-else
    >
      <span v-html="message || types[type].description"></span>
    </div>
  </div>
</template>

<style lang="scss" module>
.actionResult {
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 12px 0 20px;
  width: 100%;
}

.titleMain {
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 10px;
}

.titleSub {
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.titleSubSlave {
  color: darken(#fff, 30%);
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 5px;
}

.icon {
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.code {
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  color: #06eaa7;
}

.description {
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.descriptionSlave {
  color: darken(#fff, 30%);
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
}

.email {
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;
  color: #ffffff;
  margin-top: 8px;
}
</style>
