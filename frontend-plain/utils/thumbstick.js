export const onThumbstickMoved = (e) => {
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

export const onThumbstickRotation = (e) => {
    vrLogger.value.setAttribute('value', JSON.stringify(e.detail))
    const vectorX = -e.detail.x

    const prevRotation = rig.value.getAttribute('rotation')
    const nextRotation = `${prevRotation.x} ${vectorX + prevRotation.y} ${prevRotation.z}`
    rig.value.setAttribute('rotation', nextRotation)
}
