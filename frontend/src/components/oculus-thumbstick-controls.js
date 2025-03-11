AFRAME.registerComponent('oculus-thumbstick-controls', {
  schema: {
    acceleration: { default: 45 },
    rigSelector: { default: '#rig' },
    fly: { default: false },
    controllerOriented: { default: false },
    adAxis: { default: 'x', oneOf: ['x', 'y', 'z'] },
    wsAxis: { default: 'z', oneOf: ['x', 'y', 'z'] },
    enabled: { default: true },
    adEnabled: { default: true },
    adInverted: { default: false },
    wsEnabled: { default: true },
    wsInverted: { default: false },
  },

  init: function () {
    this.easing = 1.1
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.tsData = new THREE.Vector2(0, 0)
    this.thumbstickMoved = this.thumbstickMoved.bind(this)
    this.el.addEventListener('thumbstickmoved', this.thumbstickMoved)
  },

  update: function () {
    this.rigElement = document.querySelector(this.data.rigSelector)
  },

  tick: function (time, delta) {
    if (!this.el.sceneEl.is('vr-mode')) return

    var data = this.data
    var el = this.rigElement
    var velocity = this.velocity

    if (!velocity[data.adAxis] && !velocity[data.wsAxis] && !this.tsData.length()) {
      return
    }

    // Update velocity.
    delta = delta / 1000
    this.updateVelocity(delta)

    if (!velocity[data.adAxis] && !velocity[data.wsAxis]) {
      return
    }

    // Get movement vector and translate position.
    el.object3D.position.add(this.getMovementVector(delta))
  },

  thumbstickMoved: function (evt) {
    var data = this.data
    var tsData = this.tsData
    var axis = evt.detail.axis
    var value = evt.detail.value

    if (axis === 'x') {
      tsData.x = value
    } else if (axis === 'y') {
      tsData.y = value
    }
  },

  updateVelocity: function (delta) {
    var data = this.data
    var velocity = this.velocity
    var tsData = this.tsData

    if (tsData.length() === 0) {
      return
    }

    var direction = new THREE.Vector3(tsData.x, 0, tsData.y).normalize()
    var speed = data.acceleration * delta
    velocity.add(direction.multiplyScalar(speed))

    // Apply damping.
    velocity.multiplyScalar(this.easing)
  },

  getMovementVector: function (delta) {
    var data = this.data
    var velocity = this.velocity
    var direction = new THREE.Vector3(0, 0, 0)

    if (velocity[data.adAxis]) {
      direction[data.adAxis] = velocity[data.adAxis]
    }
    if (velocity[data.wsAxis]) {
      direction[data.wsAxis] = velocity[data.wsAxis]
    }

    return direction
  },
})
