import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
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
        {
          id: 0,
          status: 1, // 0: todo | 1: completed
          describe: 'test'
        }
      ]
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
        this.dispatch('toDoCompleted')
        state.playMode = 1
        state.timine = state.setting.breakDuration
        // state.timeout = setInterval(payload.callback, state.checkTimeoutTime)
        state.timeout = setInterval(payload.callback, 1000)
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
        state.todoList[state.activeTodo + 1].status = 1
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
              commit('stop', 'auto')
              return
          }
        }
        commit('run')
      },
      changeTodo ({ commit }, payload) {
        commit('changeTodo', payload)
      },

      toDoCompleted({commit}) {
        commit('toDoCompleted')
      }
    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
