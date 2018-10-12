{
  let view = {
    el: $('#editor'),
    templet: `
      <h2>新建歌曲</h2>
      <form>
        <div class="row">
          <label for="">歌曲：</label>
          <input type="text" name="name" value="__name__">
        </div>
        <div class="row">
          <label for="">歌手：</label>
          <input type="text" name="singer" value="__singer__">
        </div>
        <div class="row">
          <label for="">链接：</label>
          <input type="text" name="url" value="__url__">
        </div>
        <div class="row">
          <input type="submit" value="保存">
        </div>
      </form>
    `,
    render(data) {
      let placeholders = ['name', 'singer', 'url'], newHtml = this.templet
      placeholders.map((item) => {
        newHtml = newHtml.replace(`__${item}__`, data[item] || '')
      })
      this.el.html(newHtml)
    },
  },
    model = {
      data: { id: '', name: '', singer: '', url: '' },
      add(data) {
        let SongFolder = AV.Object.extend('Songs')
        let songFolder = new SongFolder()
        let keys = ['name', 'singer', 'url']
        keys.map((item) => {
          songFolder.set(item, data[item])
        })
        songFolder.save().then((song) => {
          // this.data = {
          //   id: song.id,
          //   ...song.attributes
          // }
        }, (error) => {
          console.error(error)
        })
      },
    },
    controller = {
      view: null,
      model: null,
      init(view, model) {
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        this.bindEvents()
      },
      bindEvents() {
        window.eventhub.subscribe('newSongUploaded', (data) => {
          this.view.render(data)
        })
        window.eventhub.subscribe('songEditSaved', (data) => {
          this.model.add(data)
          this.view.render({})
        })
        this.view.el.on('submit', 'form', (e) => {
          e.preventDefault()
          let formData = {}
          $(e.target).find('input[type="text"]').map((index, item) => {
            formData[item.name] = item.value
          })
          window.eventhub.publish('songEditSaved', formData)
        })
      }
    }
  controller.init(view, model)
}