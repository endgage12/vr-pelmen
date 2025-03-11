<template>
  <div v-show="!isSceneLoaded" class="flex">Loading...</div>

  <!--  <TestStand @loaded="onLoadedScene" v-show="isSceneLoaded"></TestStand>-->
  <Storybook @loaded="onLoadedScene" v-show="isSceneLoaded"></Storybook>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import TestStand from '@/views/TestStand.vue'
import Storybook from '@/views/Storybook.vue'

const isSceneLoaded = ref(false)

const onLoadedScene = (val: boolean) => {
  isSceneLoaded.value = val
}

onMounted(() => {})
</script>

<style scoped></style>
