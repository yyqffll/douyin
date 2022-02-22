<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted () {
    document.querySelector('#app').addEventListener('mouseover', this.mouseover)
    // const scrollFunc = function (e) {
    //   console.log(e, 'e')
    //   e = e || window.event
    //   if (e && e.preventDefault) {
    //     e.preventDefault()
    //     e.stopPropagation()
    //   } else {
    //     e.returnvalue = false
    //     return false
    //   }
    // }
    // document.body.addEventListener(
    //   'mousewheel',
    //   scrollFunc,
    //   { passive: false }
    // )
  },
  beforeDestroy () {
    document.querySelector('#app').removeEventListener('mouseover', this.mouseover)
  },
  methods: {
    mouseover () {
      console.log(1)
    }
  },
}

</script>

<style>
</style>
