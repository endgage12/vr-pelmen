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
            doorModel.userData.isDoor = true;
            this.el.setObject3D('door', doorModel);
            this.el.setAttribute('door-toggle', '');
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