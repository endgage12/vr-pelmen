<template>
  <a-scene physics="debug: true" device-orientation-permission-ui="enabled: false">
    <!-- Небо и земля для создания локации -->
    <a-sky color="#87CEEB"></a-sky>
    <a-plane rotation="-90 0 0" width="50" height="50" color="#7BC8A4" static-body></a-plane>

    <!-- Декоративные элементы: здания или статичные объекты -->
    <a-box position="-8 1 -12" depth="2" height="2" width="2" color="#4CC3D9" static-body></a-box>
    <a-box position="10 2 -20" depth="4" height="4" width="4" color="#FFC65D" static-body></a-box>

    <!-- Объект, который можно захватить и кинуть (куб) -->
    <a-box position="0 3 -5" depth="1" height="1" width="1" color="#EF2D5E" dynamic-body grabbable>
    </a-box>

    <!-- Руки игрока с поддержкой захвата -->
    <a-entity
      id="leftHand"
      hand-controls="hand: left; handModelStyle: lowPoly; color: #ffcccc"
      super-hands
    ></a-entity>
    <a-entity
      id="rightHand"
      hand-controls="hand: right; handModelStyle: lowPoly; color: #ffcccc"
      super-hands
    ></a-entity>

    <!-- Камера для наблюдения (можно использовать как fallback для не-VR режима) -->
    <a-entity camera position="0 1.6 0"></a-entity>
  </a-scene>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

const onGripDown = (hand: string) => {
  console.log(hand)
}
</script>

<style scoped></style>
