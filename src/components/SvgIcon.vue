<template>
  <svg class="icon" aria-hidden="true" v-bind="$attrs" v-on="$listeners">
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
    }
  },
}
</script>

<style lang="less" scoped>
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
