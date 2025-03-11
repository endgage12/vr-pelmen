AFRAME.registerComponent('vr-logger', {
  schema: {
    maxLines: { type: 'int', default: 10 }, // Максимальное количество строк лога
    position: { type: 'vec3', default: { x: 0, y: 2, z: -3 } }, // Позиция текста в сцене
    color: { type: 'color', default: '#FFF' }, // Цвет текста
    backgroundColor: { type: 'color', default: '#000' }, // Цвет фона
    width: { type: 'number', default: 1 }, // Ширина текстового поля
    height: { type: 'number', default: 0.5 }, // Высота текстового поля
    fontSize: { type: 'number', default: 0.05 }, // Размер шрифта
  },

  init() {
    this.logs = [] // Массив для хранения сообщений лога

    // Создание фона для текста
    this.background = document.createElement('a-plane')
    this.background.setAttribute('position', { x: 0, y: 0, z: -0.01 })
    this.background.setAttribute('width', this.data.width)
    this.background.setAttribute('height', this.data.height)
    this.background.setAttribute('color', this.data.backgroundColor)
    this.el.appendChild(this.background)

    // Создание текстового элемента
    this.textEntity = document.createElement('a-text')
    this.textEntity.setAttribute('position', '0 0 0')
    this.textEntity.setAttribute('color', this.data.color)
    this.textEntity.setAttribute('width', this.data.width)
    this.textEntity.setAttribute('height', this.data.height)
    this.textEntity.setAttribute('wrap-count', 30)
    this.textEntity.setAttribute('align', 'left')
    this.textEntity.setAttribute('baseline', 'top')
    this.textEntity.setAttribute('font', 'monoid')
    this.el.appendChild(this.textEntity)

    // Установка позиции элемента
    this.el.setAttribute('position', this.data.position)
  },

  updateLog() {
    // Обновление содержимого текстового элемента
    this.textEntity.setAttribute('value', this.logs.join('\n'))
  },

  log(message) {
    // Добавление нового сообщения в лог
    this.logs.push(message)

    // Ограничение количества строк в логе
    if (this.logs.length > this.data.maxLines) {
      this.logs.shift()
    }

    // Обновление отображаемого текста
    this.updateLog()
  },
})
