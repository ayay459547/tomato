export default {
  namespaced: true,
  state: {
    setting: {
      checkTimeoutTime: 1000,
      routineDuration: 25 * 60,
      breakDuration: 5 * 60
    },
    status: 0, // 0: stop | 1: play | 2: pause
    playMode: 0, // 0: normal | 1: break
    timeout: null,
    timine: 0,
    // todo
    activeTodo: 0,
    todoList: [
      {
        id: 0,
        status: 0, // 0: todo | 1: completed
        describe: 'test'
      }
    ]
  },
  getters: {
    undoList (state) {
      return state.filter(todo => {
        return todo.status === 0
      })
    },
    completed () {
      return state.filter(todo => {
        return todo.status === 1
      })
    }
  },
  mutations: {
    start (state, payload) {
      clearInterval(state.timeout)
      state.status = 1
      state.timeout = setInterval(payload.callback, state.checkTimeoutTime)
    },
    pause (state) {
      clearInterval(state.timeout)
      state.status = 2
    },
    stop (state) {
      clearInterval(state.timeout)
      state.status = 0
      state.playMode = 0
      state.timine = state.setting.routineDuration
    },
    break (state) {
      clearInterval(state.timeout)
      state.playMode = 1
      state.timine = state.setting.breakDuration
      state.timeout = setInterval(payload.callback, state.checkTimeoutTime)
    },
    run () {
      state.timine--
    },
    changeTodo (state, payload) {
      state.activeTodo = payload.id
    }
  },
  actions: {
    start ({ state, getters, dispatch, commit }) {
      commit('start', {callback: () => dispatch('run')})
    },
    stop ({ state, commit }, payload = 'handed') {
      switch (payload) {
        case 'handed':
          commit('stop')
          return
        case 'auto':
          if (getters.undoList.length > 0) {
            commit('stop')
            commit('changeTodo', getters.undoList[0])
            commit('start')
          }
      }
    },
    pause () { // 需要保持現在時間，不改其他人狀態，計時器停止運作
      commit('pause')
    },
    run ({ state }) {
      if (state.timine === 0) {
        switch (state.playMode) {
          case 0:
            commit('break', {callback: () => dispatch('run')})
            return
          case 1:
            commit('stop', 'auto')
            return
        }
      }
      commit('run')
    },
    changeTodo ({ commit }, payload) {
      commit('changeTodo', payload)
    }
  }
}