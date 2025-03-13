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
            doorModel.setAttribute('door-toggle', '')
            // Создаем новый элемент и добавляем найденную дверь
            // const doorEl = document.createElement('a-entity');
            // doorEl.setObject3D('mesh', doorModel);
            // doorEl.setAttribute('door-toggle', '');
            // this.el.appendChild(doorEl);
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
        // Обработчик события, например, при захвате (grab-start)
        this.el.addEventListener('grab-start', () => {
            if (this.isOpen) {
                // Закрываем: возвращаем в исходное положение
                this.el.setAttribute('animation__close', {
                    property: 'rotation',
                    to: `${this.data.closedRotation.x} ${this.data.closedRotation.y} ${this.data.closedRotation.z}`,
                    dur: this.data.duration,
                    easing: 'easeInOutQuad'
                });
            } else {
                // Открываем: поворачиваем дверь на заданный угол
                this.el.setAttribute('animation__open', {
                    property: 'rotation',
                    to: `${this.data.openRotation.x} ${this.data.openRotation.y} ${this.data.openRotation.z}`,
                    dur: this.data.duration,
                    easing: 'easeInOutQuad'
                });
            }
            this.isOpen = !this.isOpen;
        });
    }
});