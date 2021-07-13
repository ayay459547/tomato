export default {
  namespaced: true,
  state: {
    musicList: [
      {
        name: "song1",
        src: require("assets/music/song1.mp3")
      },{
        name: "song2",
        src: require("assets/music/song2.mp3")
      },{
        name: "song3",
        src: require("assets/music/song3.mp3")
      },{
        name: "song4",
        src: require("assets/music/song4.mp3")
      },{
        name: "song5",
        src: require("assets/music/song5.mp3")
      }
    ],
    current: 0,
    audioEl: null
  },
  getters: {
    currentSong(state) {
      return state.musicList[state.current].src
    }
  },
  mutations: {
    changeSong(state, index) {
      state.current = index
    },
    setAudioEl(state, elemnet) {
      state.audioEl = elemnet
    }
  },
  actions: {
    audioPlay({ state }) {
      state.audioEl.play()
    },
    audioPause({ state }) {
      state.audioEl.pause()
    },
    audioStop({ state }) {
      state.audioEl.pause()
      state.audioEl.currentTime = 0
    },

    
    volume({ state }, volume) {
      state.audioEl.element.volume += volume
    },
    progress({ state }, progress) {
      state.audioEl.element.currentTime += progress
    },

    changeSong({commit}, index) {
      commit('changeSong', index)
    }
  },
}