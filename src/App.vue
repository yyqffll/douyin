<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted () {
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
  }
}

</script>

<style>
</style>
