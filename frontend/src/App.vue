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

    <a-camera>
      <a-cursor></a-cursor>
    </a-camera>

    <!-- Player. -->
    <a-entity id="cameraRig">
      <a-entity
        id="camera"
        position="0 1.6 0.5"
        camera="far: 10000"
        look-controls
        player-height
        wasd-controls="acceleration: 15"
      ></a-entity>
      <a-entity
        id="cameraWallCollider"
        follow-position="target: #camera"
        raycaster__wall="objects: [data-wall-active]; interval: 150; direction: 0 -1 0; far: 5"
        visible="false"
      ></a-entity>
    </a-entity>

    <a-entity
      id="controllerRig"
      proxy-event="event: recentered; to: #cameraRig; captureBubbles: true; as: recenter"
    >
      <a-entity
        id="leftHand"
        class="weapon"
        bind__hand-swapper="enabled: {{ otherHand }}RaycasterActive"
        bind__haptics-wall="enabled: isPlaying && gameMode === 'classic'"
        bind__headfist="isPlaying: isPlaying"
        bind__menu-controls="enabled: mainMenuActive"
        bind__pauser="enabled: isPlaying"
        bind__punch="enabled: isPlaying && gameMode === 'punch'"
        bind__raycaster="enabled: leftRaycasterActive"
        bind__raycaster__game="enabled: isPlaying && (gameMode === 'classic' || gameMode === 'punch')"
        bind__blade="enabled: isPlaying && gameMode === 'classic'"
        bind__weapon-particles="enabled: isPlaying; gameMode: gameMode"
        bind__trail="colorScheme: colorScheme; enabled: isPlaying && gameMode === 'classic'"
        controller="hand: left"
        data-hand="left"
        haptics="events: mouseenter; dur: 35; force: 0.075"
        haptics__beat="events: beathaptic; dur: 90; force: 0.55"
        haptics__draw="events: drawblade; dur: 750; force: 0.025"
        haptics__plume="events: plumepulse; dur: 35; force: 0.1"
        headfist="hand: left"
        raycaster="objects: [raycastable]; far: 5; showLine: false"
        raycaster__game="objects: [raycastable-game]; far: 1; interval: {{ hand == 'right' and '70' or '71' }}; direction: 0 1 -1"
        weapon="hand: left"
        weapon-particles="hand: left"
        thumb-controls
        thumb-controls-debug="enabled: false; hand: left; controllerType: meta-controls"
        render-order="weapon"
        trail="color: secondary; hand: left"
      >
        <a-entity
          id="mouseCursor"
          bind__raycaster="enabled: !inVR"
          cursor="rayOrigin: mouse"
          raycaster="objects: [raycastable]"
        ></a-entity>
        <a-entity
          id="mouseCursorMesh"
          mixin="cursorMesh"
          cursor-mesh="cursorEl: #mouseCursor"
          bind__cursor-mesh="active: menuActive"
          render-order="cursor"
        ></a-entity>

        <a-entity
          tail="target: #leftstar"
          render-order="weapon"
          bind__visible="isPlaying && gameMode === 'ride'"
        ></a-entity>
        <a-entity
          tail="target: #rightstar"
          render-order="weapon"
          bind__visible="isPlaying && gameMode === 'ride'"
        ></a-entity>
      </a-entity>
    </a-entity>

    <!-- Руки игрока с поддержкой захвата -->
    <!--    <a-entity-->
    <!--      id="camera"-->
    <!--      camera-->
    <!--      position="0 1.6 0"-->
    <!--      look-controls="pointerLockEnabled: true"-->
    <!--      wasd-controls="acceleration:100"-->
    <!--    >-->
    <!--      <a-entity-->
    <!--        id="leftHand"-->
    <!--        geometry="primitive: sphere; radius: 0.1"-->
    <!--        material="color: #ffcccc"-->
    <!--        position="-0.2 1.5 -0.5"-->
    <!--        super-hands="usePhysics: only; constraintComponentName: ammo-constraint"-->
    <!--        raycaster="objects: .interactive"-->
    <!--        vive-controls="hand: left"-->
    <!--        oculus-touch-controls="hand: left"-->
    <!--        grabbable-->
    <!--        stretchable-->
    <!--        draggable-->
    <!--        visible="true"-->
    <!--      ></a-entity>-->
    <!--      <a-entity-->
    <!--        id="rightHand"-->
    <!--        geometry="primitive: sphere; radius: 0.1"-->
    <!--        material="color: #ffcccc"-->
    <!--        position="0.2 1.5 -0.5"-->
    <!--        super-hands="usePhysics: only; constraintComponentName: ammo-constraint"-->
    <!--        raycaster="objects: .interactive"-->
    <!--        vive-controls="hand: right"-->
    <!--        oculus-touch-controls="hand: right"-->
    <!--        grabbable-->
    <!--        stretchable-->
    <!--        draggable-->
    <!--        visible="true"-->
    <!--      ></a-entity>-->
    <!--    </a-entity>-->
  </a-scene>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

const onGripDown = (hand: string) => {
  console.log(hand)
}
</script>

<style scoped></style>
