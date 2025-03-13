AFRAME.registerComponent('find-door', {
    init: function () {
        this.el.addEventListener('model-loaded', evt => {
            const model = evt.detail.model;
            console.log(model)
            // model.traverse((child) => {
            //     const isDoor = child.name.includes('Trunkdoor_Left'); // задняя левая дверь
            //     const door = isDoor ? child : null;
            //     // if (door) door.visible = false;
            // });

            model.traverse(child => {
                if (child.name.includes('Trunkdoor_Left')) {
                    // Создаем обертку A-Frame
                    const doorEl = document.createElement('a-entity');
                    doorEl.setObject3D('mesh', child);
                    // Добавляем компонент door-toggle для управления
                    doorEl.setAttribute('door-toggle', '');
                    // Добавляем элемент в сцену или как потомок исходного элемента модели
                    this.el.appendChild(doorEl);
                }
            });
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