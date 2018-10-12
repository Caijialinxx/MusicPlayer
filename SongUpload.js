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
        this.bindEvents()
        this.initQiniu()
      },
      bindEvents() {
        window.eventhub.subscribe('newSongUploaded', () => {
          this.view.render()
        })
        this.view.el.on('click', () => {
          window.eventhub.publish('newSong')
        })
      },
      initQiniu() {
        Qiniu.uploader({
          runtimes: 'html5',
          browse_button: 'uploader',
          uptoken_url: 'http://localhost:8080/uptoken',
          domain: 'pf6pnq6ld.bkt.clouddn.com',
          get_new_uptoken: false,
          max_file_size: '20mb',
          dragdrop: true,
          drop_element: 'uploader',
          auto_start: true,
          init: {
            // 'FilesAdded': (uploader, files) => {
            //   plupload.each(files, function (file) {
            //     // 文件添加进队列后,处理相关的事情
            //   })
            // },
            'BeforeUpload': (uploader, file) => {
              if (file.type.indexOf('audio') === -1) {
                alert('请选择音频文件！')
                uploader.destroy()
                // uploader.stop()
              }
              if (file.size > uploader.settings.max_file_size * 1024 * 1024) {
                alert('文件不能超过20MB！')
                uploader.destroy()
                // uploader.stop()
              }
            },
            'UploadProgress': (uploader, file) => {
              this.view.el.html(`上传中... ${file.percent}%`)
            },
            // 文件上传成功之后调用 FileUploaded
            'FileUploaded': (uploader, file, info) => {
              let songName = JSON.parse(info.response).key,
                sourceLink = 'http://' + uploader.settings.domain + '/' + encodeURIComponent(songName)
              window.eventhub.publish('newSongUploaded', {
                url: sourceLink,
                name: songName
              })
            },
            'Error': (uploader, err, errTip) => {
              console.error(err)
            },
          }
        })
      }
    }
  controller.init(view, model)
}