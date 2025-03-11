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

    <a-entity ref="rig" id="rig" position="0 0 0">
      <a-entity camera wasd-control look-controls position="0 1.65 0"></a-entity>
    </a-entity>

    <a-entity
      @thumbstickmoved="onThumbstickMoved"
      meta-touch-controls="hand: left; model: true;"
    ></a-entity>

    <a-entity
      @thumbstickmoved="onThumbstickMoved"
      meta-touch-controls="hand: right; model: true;"
    ></a-entity>
  </a-scene>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['loaded'])

const vrLogger = ref()
const rig = ref()

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

const onThumbstickMoved = (e: any) => {
  vrLogger.value.setAttribute('value', JSON.stringify(e.detail))
  const vectorX = e.detail.x
  const vectorY = e.detail.y

  rig.value.setAttribute('position', `${vectorX} 0 ${vectorY}`)
}
</script>

<style scoped></style>
