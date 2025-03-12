<template>
  <a-scene @loaded="onLoad">
    <a-sky color="#87CEEB"></a-sky>
    <a-plane rotation="-90 0 0" width="50" height="50" color="#7BC8A4" static-body></a-plane>
    <a-text
      ref="vrLogger"
      id="vrLogger"
      position="0 2 -10"
      value="Hi"
      geometry="primitive:plane"
    ></a-text>

    <a-box
      position="0 1 -5"
      depth="1"
      height="1"
      width="1"
      color="#EF2D5E"
      dynamic-body
      grabbable
    ></a-box>

    <a-entity ref="rig" id="rig" position="0 0 0" rotation="0 0 0">
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
import * as THREE from 'three'

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
  const vectorX = -e.detail.x

  const prevRotation = rig.value.getAttribute('rotation')
  const nextRotation = `${prevRotation.x} ${vectorX + prevRotation.y} ${prevRotation.z}`
  rig.value.setAttribute('rotation', nextRotation)
}

const onThumbstickMoved = (e: any) => {
  const movementSpeed = 0.1

  // Получаем камеру внутри rig
  const cameraEl = rig.value.querySelector('[camera]')
  const direction = new THREE.Vector3()
  cameraEl.object3D.getWorldDirection(direction)

  // Обнуляем вертикальную компоненту и нормализуем вектор
  direction.y = 0
  direction.normalize()

  // Получаем вектор вправо через векторное произведение с вектором вверх
  const up = new THREE.Vector3(0, 1, 0)
  const right = new THREE.Vector3().crossVectors(direction, up).normalize()

  // Вычисляем смещения
  const forwardMovement = direction.clone().multiplyScalar(e.detail.y * movementSpeed)
  const sidewaysMovement = right.clone().multiplyScalar(-e.detail.x * movementSpeed)

  // Обновляем позицию rig
  rig.value.object3D.position.add(forwardMovement).add(sidewaysMovement)
}
</script>

<style scoped></style>
