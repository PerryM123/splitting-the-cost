<!-- TODO: prettierは効いてない -->
<template>
  <h1 class="title">
    <slot></slot>
  </h1>
</template>
<script lang="ts" setup>
// const props = defineProps({
//   title: { type: String, required: true }
// })
</script>
<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 27px;
  margin: 0;
}
</style>