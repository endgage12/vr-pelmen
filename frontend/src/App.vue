<template>
  <div v-if="!isSceneLoaded" class="flex">Loading...</div>

  <!--  <TestStand v-else></TestStand>-->
  <Storybook v-else></Storybook>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import TestStand from '@/views/TestStand.vue'
import Storybook from '@/views/Storybook.vue'

const isSceneLoaded = ref(false)

const onGripDown = (hand: string) => {
  console.log(hand)
}

onMounted(() => {
  setTimeout(() => {
    isSceneLoaded.value = true
  }, 3000)
})
</script>

<style scoped></style>
