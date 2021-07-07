<template>
  <div class="container" :class="{'bg-blue': isBgBlue}">
    <div class="row">
      <div class="col-9" @click.stop="routerPush('timing', 0)">
        <h4 v-show="!isShow && !isBgBlue">當前任務 : {{undoList[activeTodo]}}</h4>
        <h4 v-show="isBgBlue">休息</h4>
        <q-input
          class="input"
          @click.stop="title = ''"
          @blur="title = title === ''? '輸入任務名稱': title" 
          v-show="isShow && !isBgBlue" 
          v-model="title"
          @keyup.enter="addTitle(title)">
          <template v-slot:append>
            <q-icon @click.stop="addTitle(title)" name="add"></q-icon>
          </template>
        </q-input>

        <div class="title">
          <h4 v-if="!undoList.length" style="opacity:0.4">沒有任務</h4>
          <q-scroll-area v-else style="height: 100%; width: 100%">
            <ul v-show="!isBgBlue">
              <li v-for="(item, index) in undoList" 
                :key="item.id"
                :class="{border:activeTodo === index}"
                @click.stop="changeTitle(item)">
                <q-icon name="alarm"></q-icon>
                {{item.describe}}
                <q-btn icon="delete" @click.stop="del(index)" round></q-btn>
              </li>
            </ul>
          </q-scroll-area>
          
        </div>

        <div class="alarm">
          {{min}}:{{sec}}
        </div>
        <q-btn style="width: 150px" @click="start" class="btn" icon="play_arrow">start</q-btn>
        <q-btn style="width: 150px" @click="pause" class="btn" icon="pause">pause</q-btn>
        <q-btn style="width: 150px" @click="stop" class="btn" icon="stop">stop</q-btn>
        <q-btn style="width: 150px" @click="run" class="btn" icon="play_arrow">run</q-btn>
      </div>

      <div class="col-3"  @click="routerPush('timing', 0)">
        <ul>
          <li v-for="(item, index) in navList" :key="item.name">
            <q-btn class="full-width"
              :icon="item.icon"
              @click.stop="routerPush(item.name, index)"
              >{{item.name}}</q-btn>
          </li>
        </ul>
      </div>
    </div>

    <audio class="audio"
      ref="audio"
      v-show="audioChangeCounter" 
      :key="audioChangeCounter" 
      autoplay loop>
      <source :src="audioUrl">
    </audio>
    
    <div class="listRouter" :class="{active: routerAcitve}">
      <router-view @SetTimeClose='routerPush("timing",4)'></router-view>
    </div>
  </div>
</template>

<script>
import bus from "boot/bus"

export default {
  name: 'MainLayout',
  data() {
    return {
      title: "輸入任務名稱",
      navList: [
        {
          name: "timing",
          icon: "home",
        },
        {
          name: "today",
          icon: "today",
        },
        {
          name: "detail",
          icon: "description"
        },
        {
          name: "music",
          icon: "music_note",
        },
        {
          name: "setTime",
          icon: "settings",
        }
      ],
      curr: 0,
      titleList: [],
      isShow: true,
      audioUrl: "",
      audioChangeCounter: 0,
      routerAcitve: false,
    }
  },
  computed: {
    min() {
      let time = parseInt(this.alarm / 60)
      return time >= 10 ? time : `0${time}`
    },
    sec() {
      let time = parseInt(this.alarm % 60)
      return time >= 10 ? time : `0${time}`
    },
    alarm() {
      return this.$store.state.timine
    },
    today() {
      let date = new Date()
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    isBgBlue() {
      return this.$store.state.playMode
    },
    playMode() {
      return this.$store.state.playMode
    },

    activeTodo() {
      return this.$store.state.activeTodo
    },
    undoList() {
      return this.$store.getters.undoList
    },
  },
  provide () {
    return {
      changeSong: this.changeSong
    }
  },
  methods: {
    //換頁
    routerPush(router, index) {
      this.$router.push(router)
      
      if(index !== 0 && this.curr !== index){
        this.routerAcitve = false
        setTimeout(() => {
          this.routerAcitve = true 
        }, 200);
        this.curr = index
      }else if(index !== 0 && this.curr === index){
        this.routerAcitve = !this.routerAcitve
      }else{
        this.routerAcitve = false
      }
      
    },
    //開始計時
    start() {
      if(this.undoList.length <= 0) {
        alert("沒有任務")
        return false
      }

      this.$store.dispatch('start')
    },
    pause() {
      this.$store.dispatch('pause')
    },
    stop() {
      this.$store.dispatch('stop')
    },
    run() {
      this.$store.dispatch('run')
    },
    //增加任務
    addTitle(value) {
      if(value.length <= 0) {
        alert("請輸入任務名稱")
        return false
      }
      const obj = {
        id: this.undoList.length,
        status: 0,
        describe: value
      }
      this.$store.commit('addTodoList', obj)
      this.title = ''
    },
    //換當前任務
    changeTitle(item) {
      this.$store.dispatch('changeTodo', item)
    },
    //刪除任務
    del(index) {
      this.undoList.splice(index, 1)
    }
  },
  mounted() {
    bus.on("changeSong", (val) => {
      this.audioUrl = val.url
      this.audioChangeCounter = val.count
    })
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background-color: #e66464cc;

  &.bg-blue {
    background-color: rgb(187, 211, 255);
  }

  .row {
    height: 100%;

    .col-9 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      .input {
        margin-top: 30px;
        width: 250px;
        font-size: 30px;
        height: 150px;
      }
      .title {
        height: 35%;
        position: absolute;
        top: 80px;
        width: 100%;
        text-align: 150px;
        text-align: center;
        ul {
          list-style: none;
          height: 100%;
          li {
            user-select: none;
            font-size: 40px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 10px;
            border: 3px solid rgba(255, 146, 44, 0);
            transition: all 0.3s;
            &.border{
              background-color: rgb(253, 146, 164);
            }
          }
        }
      }
      .alarm {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 100px;
      }
      .btn {
        position: relative;
        top: -80px;
      }
    }

    .col-3 {
      ul {
        height: 95%;
        list-style: none;
        display: flex;
        flex-direction: column;
        li {
          width: 100%;
          display: flex;
          flex: 1;
        }
      }
    }
  }

  .listRouter {
    width: 70%;
    height: 80%;
    background: pink;
    border-radius: 20px;
    position: absolute;
    top: 90px;
    left: -100%;
    display: flex;
    transition: all 0.5s;
    opacity: 0;
    &.active {
      opacity: 0.95;
      left: 10px;
    }
    
  }
}
</style>
