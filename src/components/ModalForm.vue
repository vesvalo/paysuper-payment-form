<template>
<div :class="$style.layout">
  <div :class="$style.box">
    <div :class="$style.header">
      <div :class="$style.links">
        <a href="#" :class="$style.link">Pay Super</a>
        <a href="#" :class="$style.link">
          <IconSupport :class="$style.iconSupport" />
        </a>
        <a href="#" :class="$style.link">EN</a>
      </div>
    </div>

    <div :class="$style.content">
      <slot name="content" />
      --- Content ---
    </div>
  </div>

  <div :class="$style.footer">
    <UiButton
      :class="$style.payBtn"
      :hasBorderRadius="false"
    >
      <IconLock slot="before" />
      PAY $29
    </UiButton>
  </div>
</div>
</template>

<script>
export default {};
</script>


<style module lang="scss">
@import '@/assets/styles/reset.scss';

.layout {
  display: flex;
  width: 320px;
  background-color: #424c66;
  flex-direction: column;
}
.box {
  display: flex;
  padding: 20px;
  flex-grow: 1;
  flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
  flex-grow: 0;
}
.links {
  display: flex;
}
.link {
  font-size: 12px;
  font-weight: 500;
  color: rgba(#fff, 0.5);
  line-height: 18px;
  text-decoration: none;

  &:hover {
    color: #00d697;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
}
.iconSupport {
  cursor: pointer;
  fill: rgba(#fff, 0.5);

  &:hover {
    fill: #00d697;
  }
}
.content {
  display: flex;
  flex-grow: 1;
  color: rgba(#fff, 0.7);
  padding: 20px 0;
}
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 0;
}
.payBtn {
  width: 100%;
}
</style>
