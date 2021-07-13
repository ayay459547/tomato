export default function (audio) {
  return {
    status: (type) => {
      if(type === "play") {
        audio.play()
      }else if(type === "pause") {
        audio.pause()
      }else if(type === "stop") {
        audio.pause()
        audio.currentTime = 0
      }
    },
    volume: (value) => {
      audio.volume += value
    },
    progress: (value) => {
      audio.currentTime += value
    }
  }
} 