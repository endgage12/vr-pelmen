<template>
  <a-scene
    physics="driver: ammo; debug: true; gravity: -9.8"
    device-orientation-permission-ui="enabled: false"
    vr-mode-ui="enabled: true"
    embedded
    arjs="sourceType: webcam; debugUIEnabled: false;"
  >
    <a-assets>
      <!-- Загружаем модель утки -->
      <a-asset-item
        id="duckModel"
        src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf"
      ></a-asset-item>

      <!-- Загружаем модель AK-74M -->
      <a-asset-item id="ak74Model" src="/ak-74m/scene.gltf"></a-asset-item>
    </a-assets>

    <a-gltf-model src="#duckModel" position="0 3 -15" scale="1 1 1" dynamic-body></a-gltf-model>
    <a-gltf-model
      src="#ak74Model"
      position="0 3 -1"
      scale="0.2 0.2 0.2"
      dynamic-body
    ></a-gltf-model>

    <!-- Небо и земля для создания локации -->
    <a-sky color="#87CEEB"></a-sky>
    <a-plane rotation="-90 0 0" width="50" height="50" color="#7BC8A4" static-body></a-plane>

    <!-- Декоративные элементы: здания или статичные объекты -->
    <a-box position="-8 1 -12" depth="2" height="2" width="2" color="#4CC3D9" static-body></a-box>
    <a-box position="10 2 -20" depth="4" height="4" width="4" color="#FFC65D" static-body></a-box>
    <a-sphere position="6 2 -20" color="yellow" radius="3"></a-sphere>

    <!-- Объект, который можно захватить и кинуть (куб) -->
    <a-box position="0 3 -5" depth="1" height="1" width="1" color="#EF2D5E" dynamic-body grabbable>
    </a-box>

    <a-box position="0 1 -5" ammo-body="type: dynamic" ammo-shape="type: box"></a-box>

    <!-- Игровой риг с камерой и контроллерами -->
    <a-entity id="rig">
      <a-camera id="camera"></a-camera>
      <a-entity
        laser-controls="hand: left; model: true;"
        raycaster="near: 0.1; far: 3; objects: .clickable"
      ></a-entity>
      <a-entity
        laser-controls="hand: right; model: true;"
        raycaster="near: 0.1; far: 3; objects: .clickable"
      ></a-entity>
    </a-entity>

    <!-- Ваши 3D-объекты -->
    <a-box position="0 2 -5" color="red" class="clickable"></a-box>
  </a-scene>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

const onGripDown = (hand: string) => {
  console.log(hand)
}
</script>

<style scoped></style>
