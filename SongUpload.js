{
  let view = {
    el: $('#uploader'),
    templet: `
      <p>点击或拖拽上传歌曲</p>
      <p>文件大小不超过10M</p>
    `,
    render() {
      this.el.html(this.templet)
    },
  },
    model = {},
    controller = {
      view: null,
      model: null,
      init(view, model) {
        this.view = view
        this.model = model
        this.view.render()
      }
    }
  controller.init(view, model)
}