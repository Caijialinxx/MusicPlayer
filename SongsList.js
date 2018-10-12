{
  let view = {
    el: $('#songsList'),
    render(datas) {
      let songLis = []
      songLis = datas.map(song => {
        return $(`<li data-songId=${song.id}>${song.name}</li>`)
      })
      this.el.html(songLis)
    },
  },
    model = {
      datas: { id: '', name: '', singer: '', url: '' },
      fetch() {
        let query = new AV.Query('Songs')
        return query.find().then((songs) => {
          this.datas = songs.map(song => {
            return { id: song.id, ...song.attributes }
          })
        })
      },
    },
    controller = {
      view: null,
      model: null,
      init(view, model) {
        this.view = view
        this.model = model
        this.updateView()
        this.bindEvents()
      },
      bindEvents() {
        window.eventhub.subscribe('songEditSaved', () => {
          this.updateView()
        })
      },
      updateView() {
        this.model.fetch().then(() => {
          this.view.render(this.model.datas)
        })
      }
    }
  controller.init(view, model)
}