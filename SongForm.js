{
  let view = {
    el: $('#editor'),
    templet: `
      <h2>编辑歌曲</h2>
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
        let Songs = AV.Object.extend('Songs')
        let song = new Songs()
        let keys = ['name', 'singer', 'url']
        keys.map((item) => {
          song.set(item, data[item])
        })
        song.save()
      },
      update(data) {
        let song = AV.Object.createWithoutData('Songs', data.id)
        let keys = ['name', 'singer', 'url']
        keys.map((item) => {
          song.set(item, data[item])
        })
        song.save()
      }
    },
    controller = {
      view: null,
      model: null,
      init(view, model) {
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        this.view.el.find('h2').html('新建歌曲')
        this.bindEvents()
      },
      bindEvents() {
        window.eventhub.subscribe('newSongUploaded', (data) => {
          this.view.render(data)
        })
        window.eventhub.subscribe('songEditSaved', (data) => {
          if (data.id) {
            this.model.update(data)
          } else {
            this.model.add(data)
          }
        })
        window.eventhub.subscribe('newSong', () => {
          this.model.data = {}
          this.view.render(this.model.data)
          this.view.el.find('h2').html('新建歌曲')
        })
        window.eventhub.subscribe('editSong', (e) => {
          this.model.data = e.data
          this.view.render(this.model.data)
        })
        this.view.el.on('submit', 'form', (e) => {
          e.preventDefault()
          let formData = this.model.data
          $(e.target).find('input[type="text"]').map((index, item) => {
            formData[item.name] = item.value
          })
          window.eventhub.publish('songEditSaved', formData)
        })
      }
    }
  controller.init(view, model)
}