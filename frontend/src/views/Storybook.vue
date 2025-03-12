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

    <a-entity ref="rig" id="rig" position="0 0 0" rotation="0 45 0">
      <a-entity camera wasd-control look-controls position="0 1.65 0"></a-entity>

      <a-entity
        @thumbstickmoved="onThumbstickMoved"
        meta-touch-controls="hand: left; model: true;"
      ></a-entity>

      <a-entity
        @thumbstickmoved="onThumbstickRotation"
        meta-touch-controls="hand: right; model: true;"
      ></a-entity>
    </a-entity>
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

const onThumbstickRotation = (e: any) => {
  vrLogger.value.setAttribute('value', JSON.stringify(e.detail))
  const vectorX = e.detail.x
  const vectorZ = e.detail.z

  const prevRotation = rig.value.getAttribute('rotation')
  const nextRotation = `${vectorX + prevRotation.x} ${prevRotation.y} ${vectorZ + prevRotation.z}`
  rig.value.setAttribute('rotation', nextRotation)
}

const onThumbstickMoved = (e: any) => {
  vrLogger.value.setAttribute('value', JSON.stringify(e.detail))
  const vectorX = e.detail.x
  const vectorZ = e.detail.z

  const prevPosition = rig.value.getAttribute('position')
  const nextPosition = `${vectorX + prevPosition.x} ${prevPosition.y} ${vectorZ + prevPosition.z}`
  rig.value.setAttribute('position', nextPosition)
}
</script>

<style scoped></style>
