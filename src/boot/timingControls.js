export default class TimingControls {
  constructor(store) {
    this.timer = null
    this.store = store
  }
  //啟動時鐘
  start() {
    this.timer = setInterval(() => {
      this.store.commit('start')
      if(this.store.state.timing <= 0) {
        this.pause()
      }
    },1000)
  }
  //暫停時鐘
  pause() {
    clearInterval(this.timer)
  }
  //設定時鐘
  setTime(time) {
    this.store.commit('setTime', time)
  }
}