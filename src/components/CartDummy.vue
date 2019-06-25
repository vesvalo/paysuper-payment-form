<script>
export default {
  data() {
    return {
      dummyImagesColors: ['#985d55', '#4e58a0', '#927f46'],
    };
  },
}
</script>

<template>
<div :class="$style.container">
  <div :class="$style.images">
    <div
      v-for="(color, index) in dummyImagesColors"
      :key="index"
      :class="[$style.imageItem, $style[`_count-${dummyImagesColors.length}`]]"
      :style="{backgroundColor: color}"
    ></div>
  </div>
  <div :class="$style.listing">
    <div :class="$style.items">
      <div
        v-for="item in items"
        :class="$style.item"
        :key="item.id"
      >
        <span :class="[$style.itemCell, $style._title]">
          {{item.name}}
        </span>
        <span :class="[$style.itemCell, $style._price]">
          <span :class="$style.oldPrice" v-if="item.discount">
            {{item.price.currency}}{{item.price.value.toFixed(2)}}</span>
          {{item.amount}} {{item.currency}}
        </span>
      </div>
    </div>
  </div>
  <div :class="$style.totals">
    <div :class="$style.items">
      <div :class="[$style.item, $style.subtotal]">
        <span :class="[$style.itemCell, $style._title]"></span>
        <span :class="[$style.itemCell, $style._price]"></span>
      </div>
      <div :class="[$style.item, $style.taxes]">
        <span :class="[$style.itemCell, $style._title]"></span>
        <span :class="[$style.itemCell, $style._price]"></span>
      </div>
      <div :class="[$style.item, $style._total]">
        <span :class="[$style.itemCell, $style._title]"></span>
        <span :class="[$style.itemCell, $style._price]"></span>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" module>
.container {
  min-height: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.images {
  display: flex;
  flex-wrap: wrap;
  padding-top: 5px;
  margin: -5px -5px 9px -5px;
}
.listing {
  position: relative;
  z-index: 1;
}
.imageItem {
  flex-grow: 1;
  flex-basis: 20%;
  box-sizing: border-box;
  margin: 5px;

  &._count-5 {
    &:nth-child(1),
    &:nth-child(2) {
      flex-basis: 35%;
    }
  }

  &._count-6,
  &._count-7 {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      flex-basis: 29%;
    }
  }
}
.imageItemInner {
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 5px;

  .imageItem._count-1 & {
    padding-top: 67%;
  }
}
.items {
  display: table;
  width: 100%;
}
.item {
  display: table-row;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;

  &._total {
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
  }
}
.itemCell {
  padding: 6px 0;
  display: table-cell;

  &._title {
    width: 74%;
    padding-right: 10px;

    @include if-rtl {
      padding-right: 0;
      padding-left: 10px;
    }
  }

  &._price {
    white-space: nowrap;

    @include if-ltr {
      text-align: right;
    }

    @include if-rtl {
      text-align: left;
    }
  }
}
.totals {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  padding: 12px 0 0;

  @media screen and (max-width: 640px) {
    .cartSection._closed & {
      margin-top: 0;
    }
  }
}
</style>
