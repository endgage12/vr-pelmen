const sceneRef = document.querySelector('#sceneRef')
const rig = document.querySelector('#rig')
const vrLogger = document.querySelector('#vrLogger')

const onThumbstickMoved = (e) => {
    const movementSpeed = 0.1

    const cameraEl = rig.querySelector('[camera]')
    const direction = new THREE.Vector3()
    cameraEl.object3D.getWorldDirection(direction)

    direction.y = 0
    direction.normalize()

    const up = new THREE.Vector3(0, 1, 0)
    const right = new THREE.Vector3().crossVectors(direction, up).normalize()

    const forwardMovement = direction.clone().multiplyScalar(e.detail.y * movementSpeed)
    const sidewaysMovement = right.clone().multiplyScalar(-e.detail.x * movementSpeed)

    rig.object3D.position.add(forwardMovement).add(sidewaysMovement)
}

const onThumbstickRotation = (e) => {
    vrLogger.setAttribute('value', JSON.stringify(e.detail))
    const vectorX = -e.detail.x * 3

    const prevRotation = rig.getAttribute('rotation')
    const nextRotation = `${prevRotation.x} ${vectorX + prevRotation.y} ${prevRotation.z}`
    rig.setAttribute('rotation', nextRotation)
}

sceneRef.addEventListener('loaded', () => {
    console.log('scene loaded')
    const leftHand = sceneRef.querySelector('#leftHand')
    const rightHand = sceneRef.querySelector('#rightHand')

    if (!leftHand || !rightHand) return

    leftHand.addEventListener('thumbstickmoved', (e) => {
        onThumbstickMoved(e)
    })

    rightHand.addEventListener('thumbstickmoved', (e) => {
        onThumbstickRotation(e)
    })

    leftHand.addEventListener('gripdown', (e) => {
        vrLogger.setAttribute('value', JSON.stringify(e.detail))
        
        const intersectedEntities = [];
        const handPosition = new THREE.Vector3();
        leftHand.object3D.getWorldPosition(handPosition);

        sceneRef.querySelectorAll('[id]').forEach((entity) => {
            if (entity.id === 'leftHand' || entity.id === 'rightHand') return;

            const entityPosition = new THREE.Vector3();
            entity.object3D.getWorldPosition(entityPosition);

            const distance = handPosition.distanceTo(entityPosition);
            const collisionThreshold = 0.5;

            if (distance <= collisionThreshold) {
                intersectedEntities.push(entity);
            }
        });

        if (intersectedEntities.length > 0) {
            vrLogger.setAttribute('value', `Intersected with: ${intersectedEntities.map(e => e.id).join(', ')}`);
        } else {
            vrLogger.setAttribute('value', 'No intersection detected');
        }
    })

    rightHand.addEventListener('gripdown', (e) => {
        vrLogger.setAttribute('value', JSON.stringify(e.detail))
    })

    leftHand.addEventListener('triggerup', (e) => {
        vrLogger.setAttribute('value', JSON.stringify(e.detail))
    })

    rightHand.addEventListener('triggerup', (e) => {
        vrLogger.setAttribute('value', JSON.stringify(e.detail))
    })
})