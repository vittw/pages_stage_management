<template>
  <section :class=" isNormal ? 'normal':'default' ">
    <div class="form">
      <slot name="form"></slot>
    </div>
    <div class="table" v-if="!isNormal">
      <slot name="table"></slot>
    </div>
    <div class="pages" v-if="!isNormal">
      <slot name="pages"></slot>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    isNormal: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style lang="less" scoped>
</style>
