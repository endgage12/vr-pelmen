AFRAME.registerComponent('oculus-thumbstick-controls', {
  schema: {
    acceleration: { type: 'number', default: 45 },
    rigSelector: { type: 'string', default: '#rig' },
    fly: { type: 'boolean', default: false },
    controllerOriented: { type: 'boolean', default: false },
    adAxis: { type: 'string', default: 'x', oneOf: ['x', 'y', 'z'] },
    wsAxis: { type: 'string', default: 'z', oneOf: ['x', 'y', 'z'] },
    enabled: { type: 'boolean', default: true },
    adEnabled: { type: 'boolean', default: true },
    adInverted: { type: 'boolean', default: false },
    wsEnabled: { type: 'boolean', default: true },
    wsInverted: { type: 'boolean', default: false },
  },

  init() {
    this.easing = 1.1
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.tsData = new THREE.Vector2(0, 0)
    this.thumbstickMoved = this.thumbstickMoved.bind(this)
    this.el.addEventListener('thumbstickmoved', this.thumbstickMoved)
  },

  update() {
    this.rigElement = document.querySelector(this.data.rigSelector)
  },

  tick(time, delta) {
    if (!this.el.sceneEl.is('vr-mode')) return

    const { data, rigElement: el, velocity } = this

    if (!velocity[data.adAxis] && !velocity[data.wsAxis] && !this.tsData.length()) {
      return
    }

    // Update velocity.
    delta /= 1000
    this.updateVelocity(delta)

    if (!velocity[data.adAxis] && !velocity[data.wsAxis]) {
      return
    }

    // Get movement vector and translate position.
    el.object3D.position.add(this.getMovementVector(delta))
  },

  thumbstickMoved(evt) {
    const { axis, value } = evt.detail
    if (axis === 'x') {
      this.tsData.x = value
    } else if (axis === 'y') {
      this.tsData.y = value
    }
  },

  updateVelocity(delta) {
    const { data, velocity, tsData } = this

    if (tsData.length() === 0) {
      return
    }

    const direction = new THREE.Vector3(tsData.x, 0, tsData.y).normalize()
    const speed = data.acceleration * delta
    velocity.add(direction.multiplyScalar(speed))

    // Apply damping.
    velocity.multiplyScalar(this.easing)
  },

  getMovementVector(delta) {
    const { data, velocity } = this
    const direction = new THREE.Vector3(0, 0, 0)

    if (velocity[data.adAxis]) {
      direction[data.adAxis] = velocity[data.adAxis]
    }
    if (velocity[data.wsAxis]) {
      direction[data.wsAxis] = velocity[data.wsAxis]
    }

    return direction
  },
})
