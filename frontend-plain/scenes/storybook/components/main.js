import { onThumbstickMoved, onThumbstickRotation } from "../../../utils/thumbstick.js";

const sceneRef = document.querySelector('#sceneRef')
sceneRef.addEventListener('loaded', () => {
    console.log('scene loaded')
    const leftHand = sceneRef.querySelector('#leftHand')
    const rightHand = sceneRef.querySelector('#rightHand')

    leftHand.addEventListener('thumbstickmoved', (e) => {
        onThumbstickMoved(e)
    })

    rightHand.addEventListener('thumbstickmoved', (e) => {
        onThumbstickRotation(e)
    })
})