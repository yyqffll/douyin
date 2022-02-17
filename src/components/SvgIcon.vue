<template>
  <svg class="icon" aria-hidden="true" v-bind="$attrs" v-on="$listeners" :style="{ fontSize: fontSize + 'px' }">
    <use :xlink:href="url" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    url: {
      default: '',
      require: true
    },
    fontSize: {
      default: ''
    }
  },
}
</script>

<style lang="less" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
