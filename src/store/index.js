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
      rest: 3,
      work: 4,
      timing: 2,
      timer: null,
      flag: true,
      successList: ["任務名稱1","任務名稱2","任務名稱3","任務名稱4","任務名稱5","任務名稱6","任務名稱7","任務名稱8","任務名稱9","任務名稱10"]
    },
    mutations: {
      //啟動時鐘
      start(state) {
        // return new Promise((resolve, reject) => {

        state.timer = setInterval(() => {
          console.log(state.timing)
          if(state.timing <= 0) {
            clearInterval(state.timer)
            // resolve(123)
          }
          this.dispatch('reduce')
        },1000)

        // })
      },
      //暫停時鐘
      pause(state) {
        clearInterval(state.timer)
      },
      //設定時鐘
      setTime(state, time) {
        state.timing = parseInt(time)
      },
      addSuccess(state, name) {
        state.successList.push(name)
      },
      delSuccess(state, index) {
        state.successList.splice(index, 1)
      },
      //減秒數
      decrement(state) {
        state.timing--
      }
    },
    actions: {
      reduce({commit}) {
        commit('decrement')
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
