export default class AudioControls {
  constructor(audioElement) {
    this.audio = audioElement
  }
  changeAudioStatus(type) {
    if(type === "play") {
      this.audio.play()
    }else if(type === "pause") {
      this.audio.pause()
    }else if(type === "stop") {
      this.audio.pause()
      this.audio.currentTime = 0
    }
  }
  volumeControls(value) {
    // console.log(this.audio.volume)
    this.audio.volume += value
  }
  progressControls(value) {
    this.audio.currentTime += value
  } 
}