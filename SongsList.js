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
        window.eventhub.subscribe('newSong', () => {
          this.view.el.children().removeClass('active')
        })
        window.eventhub.subscribe('editSong', (e)=>{
          $(e.target).addClass('active').siblings().removeClass('active')
        })
        this.view.el.on('click', 'li', (e) => {
          window.eventhub.publish('editSong', {
            target: e.target,
            data: this.model.datas.filter(item => item.id === e.target.dataset.songid)[0]
          })
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