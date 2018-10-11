window.eventhub = {
  eventsList: {},
  publish(eventName, data) {
    for (let key in this.eventsList) {
      if (key === eventName) {
        this.eventsList[eventName].map((fn) => {
          fn.call(undefined, data)
        })
      }
    }
  },
  subscribe(eventName, fn) {
    if (this.eventsList[eventName] === undefined) {
      this.eventsList[eventName] = []
    }
    this.eventsList[eventName].push(fn)
  }
}