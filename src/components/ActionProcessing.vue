<script>
import { includes } from 'lodash-es';
import IconTotemFail from '@/components/IconCardSecurity.vue';
import IconTotemSuccess from '@/components/IconProcessSecurity.vue';

export default {
  name: 'ActionProcessing',

  components: {
    IconTotemFail,
    IconTotemSuccess,
  },

  props: {
    icon: {
      type: String,
      default: 'card',
      validator(value) {
        return includes(['card', 'other'], value);
      },
    },
  },
};
</script>

<template>
  <div :class="$style.actionProcessing">
    <div :class="$style.icon">
      <IconTotemFail v-if="icon === 'card'" />
      <IconTotemSuccess v-if="icon === 'other'" />
    </div>
    <div>
      <h2
        :class="$style.titleMain"
        v-html="$t('title')"
      >
      </h2>
    </div>
    <div
      :class="$style.description"
    >
      <span v-for="(chunk, index) in $t('description')" v-html="chunk" :key="index"></span>
    </div>
    <div :class="$style.preloader">
      <UiSimplePreloader />
    </div>

  </div>
</template>

<style lang="scss" module>
.actionProcessing {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0px 40px 20px;
}

.icon {
  margin-bottom: 24px;
  padding-top: 40px;
}

.titleMain {
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 18px;
}

.description {
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.preloader {
  margin-top: 60px;
}
</style>

<i18n>
{
  "en": {
    "title": "You will now be redirected<br>to the bank site for passing 3d security",
    "description": [
      "After passing the 3d security, ",
      "the status of receiving money may <br>come with a delay, ",
      "it depends directly on the bank in which you pay"
    ]
  }
}
</i18n>
