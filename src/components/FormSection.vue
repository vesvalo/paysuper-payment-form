<template>
<div :class="[$style.formSection, { [$style._hasPadding]: hasPadding }]">
  <UiSelect :options="options">
    <template v-slot:options="selectId">
      <UiSelectOption
        #options="selectId"
        v-for="option in options"
        :key="option.value"
        :option="option"
      />
    </template>
  </UiSelect>
  <UiCardField />
</div>
</template>

<script>
export default {
  name: 'FormSection',
  props: {
    hasPadding: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      options: [
        { value: 'card', label: this.$i18n.t('card'), iconComponent: 'IconCard' },
      ],
    };
  },
  computed: {},
  methods: {},
};
</script>

<style module lang="scss">
.formSection {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-items: flex-start;

  &._hasPadding {
    padding: 20px 40px;
  }
}
</style>
