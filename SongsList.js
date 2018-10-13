{
  let view = {
    el: $('#songsList'),
    templet: `
      <li data-songid="__id__">
        <span name="name">__name__</span>
        <button name="delete">删除</button>
      </li>
    `,
    render(datas) {
      let songLis = []
      songLis = datas.map(song => {
        let keys = ['id', 'name']
        let li = this.templet
        keys.map(item => {
          li = li.replace(`__${item}__`, song[item])
        })
        return li
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
      delete(id) {
        let song = AV.Object.createWithoutData('Songs', id);
        return song.destroy()
      },
    },
    controller = {
      view: null,
      model: null,
      init(view, model) {
        this.view = view
        this.model = model
        this.model.fetch().then(() => {
          this.view.render(this.model.datas)
        })
        this.bindEvents()
      },
      bindEvents() {
        window.eventhub.subscribe('songEditSaved', (data) => {
          this.updateView(data)
        })
        window.eventhub.subscribe('newSong', () => {
          this.view.el.children().removeClass('active')
        })
        window.eventhub.subscribe('editSong', (e) => {
          $(e.target).addClass('active').siblings().removeClass('active')
        })
        this.view.el.on('click', 'li', (e) => {
          if (e.target.name === 'delete') {
            let result = confirm(`确定删除？`)
            if (result) {
              this.model.delete(e.currentTarget.dataset.songid)
                .then(() => {
                  $(e.currentTarget).remove()
                  window.eventhub.publish('newSong')
                })
            }
          } else {
            window.eventhub.publish('editSong', {
              target: e.currentTarget,
              data: this.model.datas.filter(item => item.id === e.currentTarget.dataset.songid)[0]
            })
          }
        })
      },
      updateView(data) {
        let $target = this.view.el.find(`[data-songid=${data.id}]`)
        if ($target.length) {
          // 已存在，此为更新
          $target.html(data.name)
        } else {
          // 不存在，新建li
          $target = $(`<li data-songid=${data.id}>${data.name}</li>`)
          this.view.el.append($target)
        }
        $target.addClass('active').siblings().removeClass('active')
      }
    }
  controller.init(view, model)
}