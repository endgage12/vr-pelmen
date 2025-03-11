<template>
  <a-scene @loaded="onLoad">
    <a-sky color="#87CEEB"></a-sky>
    <a-plane rotation="-90 0 0" width="50" height="50" color="#7BC8A4" static-body></a-plane>
    <a-text
      ref="vrLogger"
      id="vrLogger"
      position="0 2 -2"
      value="Hi"
      geometry="primitive:plane"
    ></a-text>

    <a-entity
      @controllerconnected="onControllerConnected"
      @controllerdisconnected="onControllerDisconnected"
      @axismove="onAxisMove"
      tracked-controls="controller: 0; idPrefix: OpenVR; hand: left; handModelStyle: lowPoly; color: #ffcccc"
    ></a-entity>
  </a-scene>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['loaded'])

const vrLogger = ref()

const onLoad = () => {
  emit('loaded', true)
}

const onControllerConnected = () => {
  vrLogger.value.setAttribute('value', 'Controller connected')
}

const onControllerDisconnected = () => {
  vrLogger.value.setAttribute('value', 'Controller disconnected')
}

const onAxisMove = (e: any) => {
  vrLogger.value.setAttribute('value', JSON.stringify(e.detail))
}
</script>

<style scoped></style>
