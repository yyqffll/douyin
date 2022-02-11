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

<style>
</style>
