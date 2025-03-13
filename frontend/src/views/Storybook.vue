<template>
  <a-scene ref="sceneRef" @loaded="onLoad" stats>
    <a-assets timeout="300000" @loaded="onAssetsLoaded">
      <a-asset-item ref="carModel" id="carModel" src="/public/porsche/scene.gltf"></a-asset-item>
      <a-asset-item ref="minivanModel" id="minivanModel" src="/minivan/scene.gltf"></a-asset-item>
      <a-asset-item id="nissanModel" src="/nissan/nissan.glb"></a-asset-item>
    </a-assets>

    <a-entity position="-3 0 5" gltf-model="#minivanModel" dynamic-body></a-entity>
    <a-entity position="3 0 5" gltf-model="#carModel" dynamic-body></a-entity>
    <a-entity position="-10 0 10" gltf-model="#nissanModel" dynamic-body></a-entity>

    <a-sky color="#87CEEB"></a-sky>
    <a-plane
      rotation="-90 0 0"
      width="50"
      height="50"
      color="#7BC8A4"
      static-body
      src="https://upload.wikimedia.org/wikipedia/commons/6/68/Callisto_terrain.jpg"
    ></a-plane>
    <a-plane
      position="50 0 -50"
      rotation="-90 0 0"
      width="500"
      height="50"
      color="#7BC8A4"
      static-body
      src="https://cdn.polyhaven.com/asset_img/primary/rocky_terrain_02.png?height=760"
    ></a-plane>
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
      animation="property: object3D.position.y; to: 2.2; dir: alternate; dur: 2000; loop: true"
      dynamic-body
      grabbable
    ></a-box>

    <a-box
      hoverable
      grabbable
      stretchable
      draggable
      droppable
      color="blue"
      position="0 0 -1"
    ></a-box>

    <a-entity ref="rig" id="rig" position="0 0 0" rotation="0 0 0">
      <a-entity camera wasd-control look-controls position="0 1.65 0"></a-entity>

      <a-entity
        @thumbstickmoved="onThumbstickMoved"
        sphere-collider="objects: a-box"
        super-hands
        hand-controls="hand: left"
      ></a-entity>
      <a-entity
        @thumbstickmoved="onThumbstickRotation"
        sphere-collider="objects: a-box"
        super-hands
        hand-controls="hand: right"
      ></a-entity>
    </a-entity>
  </a-scene>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
// import * as THREE from 'three'

const emit = defineEmits(['loaded'])

const vrLogger = ref()
const rig = ref()
const carModel = ref()
const minivanModel = ref()
const sceneRef = ref()

const onLoad = () => {
  emit('loaded', true)
}

const onAssetsLoaded = () => {
  console.log('assets loaded')
  vrLogger.value.setAttribute('value', 'assets loaded')
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

  const cameraEl = rig.value.querySelector('[camera]')
  const direction = new THREE.Vector3()
  cameraEl.object3D.getWorldDirection(direction)

  direction.y = 0
  direction.normalize()

  const up = new THREE.Vector3(0, 1, 0)
  const right = new THREE.Vector3().crossVectors(direction, up).normalize()

  const forwardMovement = direction.clone().multiplyScalar(e.detail.y * movementSpeed)
  const sidewaysMovement = right.clone().multiplyScalar(-e.detail.x * movementSpeed)

  rig.value.object3D.position.add(forwardMovement).add(sidewaysMovement)
}

onMounted(() => {
  console.log('mounted')

  setTimeout(() => {
    sceneRef.value.load()
    console.log('scene loaded')
  }, 5000)
})
</script>

<style scoped></style>
