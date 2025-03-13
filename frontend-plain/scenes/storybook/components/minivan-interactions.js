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
            // Создание элемента пули
            const bullet = document.createElement('a-sphere');
            const handPos = this.el.getAttribute('position');
            bullet.setAttribute('position', handPos);
            bullet.setAttribute('radius', '0.05');
            bullet.setAttribute('color', '#EF2D5E');
            // Применяем физику с помощью physx (динамическое тело)
            bullet.setAttribute('physx-body', 'type: dynamic; mass: 0.1');

            // Добавляем пулю в сцену
            this.el.sceneEl.appendChild(bullet);

            // Здесь можно добавить код для применения импульса
            // (например, через API physx, чтобы пуля летела вперёд)
            // Псевдокод:
            // const impulse = { x: 0, y: 0, z: -10 };
            // bullet.body.applyImpulse(impulse, bullet.body.getPosition());
        });
    }
});
