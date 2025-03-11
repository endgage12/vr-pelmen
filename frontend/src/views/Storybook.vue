<template>
  <a-scene>
    <a-sky color="#87CEEB"></a-sky>
    <a-plane rotation="-90 0 0" width="50" height="50" color="#7BC8A4" static-body></a-plane>
    <a-text id="vrLogger" position="0 2 -2" value="Hi" geometry="primitive:plane"></a-text>
  </a-scene>
</template>

<script setup lang="ts"></script>

<style scoped></style>
