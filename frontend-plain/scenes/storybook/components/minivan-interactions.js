AFRAME.registerComponent('find-door', {
    init: function () {
        this.el.addEventListener('model-loaded', (evt) => {
            const model = evt.detail.model;
            let doorModel = null;

            if (!model) return;
            console.log(model);

            // Ищем первый найденный объект с именем, содержащим 'Trunkdoor_Left'
            model.traverse(child => {
                if (!doorModel && child.name && child.name.includes('Trunkdoor_Left')) {
                    doorModel = child;
                }
            });
            if (!doorModel) {
                console.warn('Дверь не найдена');
                return;
            }

            // Проверяем, что doorModel является экземпляром THREE.Object3D
            if (!(doorModel instanceof THREE.Object3D)) {
                console.error('Найденный объект не является THREE.Object3D');
                return;
            }

            console.log(doorModel);
            // Добавляем компонент 'door-toggle' к найденной двери
            // doorModel.userData.isDoor = true;
            // this.el.setObject3D('door', doorModel);
            // this.el.setAttribute('door-toggle', '');

            const doorEl = document.createElement('a-entity');
            const doorClone = doorModel.clone();
            doorEl.setObject3D('mesh', doorClone);
            doorEl.setAttribute('scale', '0.15 0.15 0.15');
            doorEl.setAttribute('position', '0 5 0');
            doorEl.setAttribute('rotation', '0 90 0');
            doorEl.setAttribute('door-toggle', '');
            this.el.appendChild(doorEl);
        });
    }
});


AFRAME.registerComponent('door-toggle', {
    schema: {
        openRotation: {type: 'vec3', default: {x: 0, y: 90, z: 0}},
        closedRotation: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        duration: {type: 'number', default: 1000}
    },
    init: function () {
        this.isOpen = false;
        // Обработчик события 'grab-start'
        this.el.addEventListener('grab-start', () => {
            const door = this.el.getObject3D('door');
            if (!door) return;

            const targetRotation = this.isOpen ? this.data.closedRotation : this.data.openRotation;
            // Анимация вращения двери
            new TWEEN.Tween(door.rotation)
                .to({
                    x: THREE.Math.degToRad(targetRotation.x),
                    y: THREE.Math.degToRad(targetRotation.y),
                    z: THREE.Math.degToRad(targetRotation.z)
                }, this.data.duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();

            this.isOpen = !this.isOpen;
        });
    },
    tick: function (time) {
        TWEEN.update(time);
    }
});

AFRAME.registerComponent('shooting', {
    init: function () {
        this.el.addEventListener('triggerdown', () => {
            // Создаем элемент пули
            const bullet = document.createElement('a-sphere');
            bullet.setAttribute('radius', '0.05');
            bullet.setAttribute('color', '#EF2D5E');
            bullet.setAttribute('physx-body', 'type: dynamic; mass: 0.1');

            // Получаем мировую позицию руки
            const handWorldPos = new THREE.Vector3();
            this.el.object3D.getWorldPosition(handWorldPos);
            bullet.setAttribute('position', handWorldPos);

            // Добавляем пулю в сцену
            this.el.sceneEl.appendChild(bullet);

            // Получаем направление выстрела из руки
            const direction = new THREE.Vector3();
            this.el.object3D.getWorldDirection(direction);

            // Определяем силу выстрела (настройте по своему усмотрению)
            const force = 30; // сила импульса

            // Рассчитываем импульс как вектор
            const impulse = {
                x: direction.x * force,
                y: direction.y * force,
                z: direction.z * force
            };

            // Применяем импульс с небольшой задержкой, чтобы убедиться,
            // что физическое тело пули полностью инициализировано
            setTimeout(() => {
                if (bullet.body) {
                    // Применяем импульс в позиции пули
                    bullet.body.AddForceAtPosition(impulse, bullet.body.getPosition());
                } else {
                    console.warn('Физическое тело пули не найдено или API изменился.');
                }
            }, 50);
        });
    }
});

AFRAME.registerComponent('physx-force-pushable', {
    schema: {
        force: { default: 10 }
    },
    init: function () {

        this.pStart = new THREE.Vector3();
        this.sourceEl = this.el.sceneEl.querySelector('[camera]');
        this.forcePushPhysX = this.forcePushPhysX.bind(this);


        this.sourcePosition = new THREE.Vector3();
        this.force = new THREE.Vector3();
        this.pos = new THREE.Vector3();
    },

    play() {
        this.el.addEventListener('click', this.forcePushPhysX);
    },

    pause() {
        this.el.removeEventListener('click', this.forcePushPhysX);
    },

    forcePushPhysX: function (e) {

        const el = this.el
        if (!el.components['physx-body']) return
        const body = el.components['physx-body'].rigidBody
        if (!body) return

        const force = this.force
        const source = this.sourcePosition

        // WebXR requires care getting camera position https://github.com/mrdoob/three.js/issues/18448
        source.setFromMatrixPosition( this.sourceEl.object3D.matrixWorld );

        el.object3D.getWorldPosition(force)
        force.sub(source)

        force.normalize();

        // not sure about units, but force seems stronger with PhysX than Cannon, so scaling down
        // by a factor of 5.
        force.multiplyScalar(this.data.force / 5);

        // use data from intersection to determine point at which to apply impulse.
        const pos = this.pos
        pos.copy(e.detail.intersection.point)
        el.object3D.worldToLocal(pos)

        body.addImpulseAtLocalPos(force, pos);
    }
});
