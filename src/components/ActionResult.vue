<script>
import IconTotemFail from '@/components/IconTotemFail.vue';
import IconTotemSuccess from '@/components/IconTotemSuccess.vue';
import IconCardCracked from '@/components/IconCardCracked.vue';
import IconCardFail from '@/components/IconCardFail.vue';
import IconCardSuccess from '@/components/IconCardSuccess.vue';
import IconLetsPlay from '@/components/IconLetsPlay.vue';
import UiTextField from '@/components/UiTextField.vue';

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
    content: {
      type: String,
      default: 'success',
    },

    step: {
      type: String,
      default: 'initial',
    },

    paymentMethod: {
      type: String,
      default: 'card',
    },

    code: {
      type: String,
      default: '88456-89735-87635-98372',
    },
  },

  data() {
    return {
      email: '',
      contents: {
        declined: {
          title: this.$t('ActionResult.declined.title'),
          subtitle: this.$t('ActionResult.declined.subtitle'),
          iconComponent: {
            card: 'IconCardCracked',
            other: 'IconTotemFail',
          },
          description: this.$t('ActionResult.declined.description'),
        },
        error: {
          title: this.$t('ActionResult.error.title'),
          subtitle: this.$t('ActionResult.error.subtitle'),
          iconComponent: {
            card: 'IconCardFail',
            other: 'IconTotemFail',
          },
          description: this.$t('ActionResult.error.description'),
        },
        success: {
          title: this.$t('ActionResult.success.title'),
          iconComponent: {
            card: 'IconCardSuccess',
            other: 'IconTotemSuccess',
          },
        },
      },
    };
  },
};
</script>

<template>
  <div :class="$style.actionResult">
    <div>
      <h2 :class="$style.titleMain">{{contents[content].title}}</h2>
      <div v-if="content === 'success'">
        <p :class="$style.titleSubSlave">
          {{$t('ActionResult.success.titleSubSlave')}}
        </p>
        <p :class="$style.code">{{code}}</p>
      </div>
      <p
        :class="$style.titleSub"
        v-else
      >{{contents[content].subtitle}}</p>
    </div>
    <div :class="$style.icon">
      <component :is="contents[content].iconComponent[paymentMethod]" />
    </div>
    <div v-if="content === 'success'">
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
      <span v-html="contents[content].description"></span>
    </div>
  </div>
</template>

<style lang="scss" module>
.actionResult {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  padding: 0px 40px 20px;
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
