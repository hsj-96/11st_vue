<template>
  <LNB />
  <RNB />
  <TheHeader />
</template>

<script>
import LNB from '~/components/LNB'
import RNB from '~/components/RNB'
import TheHeader from '~/components/TheHeader'

export default {
  components: {
    LNB,
    RNB,
    TheHeader
  }
}
</script>

<style lang="scss">
@import "~/scss/main";
</style>
