{
  let view = {
    el: $('aside h2'),
    templet: `新建歌曲`,
    render() {
      this.el.html(this.templet)
      this.active()
    },
    active() {
      this.el.addClass('active')
    },
    deactive() {
      this.el.removeClass('active')
    }
  },
    controller = {
      view: null,
      init(view) {
        this.view = view
        this.view.render()
        this.bindEvents()
      },
      bindEvents() {
        window.eventhub.subscribe('editSong', () => {
          this.view.deactive()
        })
        window.eventhub.subscribe('newSong', () => {
          this.view.active()
        })
        this.view.el.on('click', () => {
          window.eventhub.publish('newSong')
        })
      }
    }
  controller.init(view)
}