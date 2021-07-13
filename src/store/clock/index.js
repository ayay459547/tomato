export default {
  namespaced: true,
  state: {
    setting: {
      checkTimeoutTime: 1000,
      routineDuration: 5,
      breakDuration: 3
    },
    status: 0, // 0: stop | 1: play | 2: pause
    playMode: 0, // 0: normal | 1: break
    timeout: null,
    timine: 3,
    // todo
    activeTodo: 0,
    todoList: [
      // {
      //   id: 0,
      //   status: 1, // 0: todo | 1: completed | 2: del
      //   describe: 'test'
      // }
    ],
    date: new Date()
  },

  getters: {
    undoList (state) {
      return state.todoList.filter(todo => {
        return todo.status === 0
      })
    },
    completed (state) {
      return state.todoList.filter(todo => {
        return todo.status === 1
      })
    },
    today (state) {
      return `${state.date.getMonth() + 1}/${state.date.getDate()}`
    }
  },

  mutations: {
    start (state, payload) {
      clearInterval(state.timeout)
      state.status = 1
      // state.timeout = setInterval(payload.callback, state.checkTimeoutTime)
      state.timeout = setInterval(payload.callback, 1000)
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
    break (state, payload) {
      clearInterval(state.timeout)
      this.dispatch('clock/toDoCompleted')
      this.dispatch('clock/setCookie')
      state.playMode = 1
      state.timine = state.setting.breakDuration
      state.timeout = setInterval(payload.callback, 1000)
      // state.timeout = setInterval(payload.callback, state.checkTimeoutTime)
    },
    run (state) {
      state.timine--
    },
    changeTodo (state, payload) {
      state.activeTodo = payload.id
    },
    setTimine(state, newTimine) {
      state.timine = newTimine
    },
    addTodoList(state, obj) {
      state.todoList.push(obj)
    },
    toDoCompleted(state) {
      state.todoList[state.activeTodo].status = 1
    },
    delTodoList(state, payload) {
      state.todoList[payload.id].status = 2
      this.dispatch('clock/setCookie')
    },
  },

  actions: {
    start ({ state, getters, dispatch, commit }) {
      commit('start', {callback: () => dispatch('run')})
    },
    stop ({ state, getters, commit, dispatch }, payload = 'handed') {
      switch (payload) {
        case 'handed':
          commit('stop')
          return
        case 'auto':
          if (getters.undoList.length > 0) {
            commit('stop')
            dispatch('changeTodo', getters.undoList[0])
            dispatch('start')
          }else if( getters.undoList.length == 0) {
            commit('stop')
          }
      }
    },
    pause ({commit}) { // 需要保持現在時間，不改其他人狀態，計時器停止運作
      commit('pause')
    },
    run ({ state, commit, dispatch }) {
      if (state.timine === 0) {
        switch (state.playMode) {
          case 0:
            commit('break', {callback: () => dispatch('run')})
            return
          case 1:
            dispatch('stop', 'auto')
            return
        }
      }
      commit('run')
    },
    changeTodo ({ commit }, payload) {
      commit('changeTodo', payload)
    },

    toDoCompleted({ commit }) {
      commit('toDoCompleted')
    },
    setCookie( context ) {
      document.cookie = `${context.getters.today} = ${context.getters.completed.length}; expires = ${6 * 24 * 60 * 60 * 1000}`
    },
  },
}