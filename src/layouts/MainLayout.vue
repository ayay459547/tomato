<template>
  <div class="container" :class="{'bg-blue': playMode}">
    <div class="row">
      <div class="col-9" @click.stop="routerPush('timing', 0)">
        <h4 v-show="!isShow && !playMode">當前任務 : {{undoList[activeTodo]}}</h4>
        <h4 v-show="playMode">休息</h4>
        <q-input
          class="input"
          @click.stop="title = ''"
          @blur="title = title === ''? '輸入任務名稱': title" 
          v-show="isShow && !playMode" 
          v-model="title"
          @keyup.enter="addTitle(title)">
          <template v-slot:append>
            <q-icon @click.stop="addTitle(title)" name="add"></q-icon>
          </template>
        </q-input>

        <div class="title">
          <h4 v-if="!undoList.length" style="opacity:0.4">沒有任務</h4>
          <q-scroll-area v-else style="height: 100%; width: 100%">
            <ul v-show="!playMode">
              <li v-for="item in undoList" 
                :key="item.id"
                :class="{border:activeTodo === item.id}"
                @click.stop="changeTitle(item)">
                <q-icon name="alarm"></q-icon>
                {{item.describe}}
                <q-btn icon="delete" @click.stop="del(item)" round></q-btn>
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

    <div class="music">
      <q-card :class="{musicShow: musicShow}"
        class="my-card" 
        style="background: pink">
        <q-card-section>
          <div class="text-h6">music list
            <q-btn icon="close" 
              style="width:40px; height: 40px; margin: 10px 10px 0 0"
              class="absolute-top-right"
              @click="musicShow = false, musicBtnHide = false"></q-btn>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions vertical>
          <q-btn flat v-for="(item, index) in musicList"
            :key="item.name"
            :class="{musicActive: musicActive == index}"
            @click.stop="changeSong(index)">{{item.name}}</q-btn>
        </q-card-actions>
        <q-separator />
        <q-card-section>
          <q-btn style="width: 60px" icon="fast_rewind" @click.stop="decrement('progress', 0.1)"></q-btn>
          <q-btn style="width: 60px" icon="fast_forward" @click.stop="increment('progress', 0.1)"></q-btn>
          <q-btn style="width: 60px" icon="volume_down" @click.stop="decrement('volume', 10)"></q-btn>
          <q-btn style="width: 60px" icon="volume_up" @click.stop="increment('volume', 10)"></q-btn>
          <br/>
          <q-btn style="width: 80px" @click.stop="audioStatus('play')">play</q-btn>
          <q-btn style="width: 80px" @click.stop="audioStatus('pause')">pause</q-btn>
          <q-btn style="width: 80px" @click.stop="audioStatus('stop')">stop</q-btn>
        </q-card-section>
      </q-card>

      <q-btn :class="{musicBtnHide: musicBtnHide}" 
        icon="library_music" size="lg" 
        class="absolute-bottom-right" 
        @click="musicShow = !musicShow, musicBtnHide = !musicBtnHide"
        ></q-btn>
    </div>

    <audio class="audio"
      ref="audio"
      v-show="audioChangeCounter" 
      :key="audioChangeCounter" 
      autoplay loop>
      <source :src="audioUrl">
    </audio>
    
    <div class="listRouter" :class="{active: routerAcitve}">
      <router-view @SetTimeClose='routerPush("timing",3)'></router-view>
    </div>
  </div>
</template>

<script>
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
          name: "setTime",
          icon: "settings",
        }
      ],
      curr: 0,
      titleList: [],
      isShow: true,
      audioChangeCounter: 0,
      routerAcitve: false,
      musicShow: false,
      musicBtnHide: false,
      currControls: null,
      audioEl: null
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
      return this.$store.state.clock.timine
    },
    playMode() {
      return this.$store.state.clock.playMode
    },
    activeTodo() {
      return this.$store.state.clock.activeTodo
    },
    todoList() {
      return this.$store.state.clock.todoList
    },
    undoList() {
      return this.$store.getters['clock/undoList']
    },
 

    musicList() {
      return this.$store.state.audio.musicList
    },
    audioUrl() {
      return `${this.$store.getters['audio/currentSong']}`
    },
    musicActive() {
      return this.$store.state.audio.current
    }
  },
  watch: {
    playMode: function (newValue, oddValue) {
      if(newValue == 0 && oddValue == 1) {
        if(this.undoList.length == 0) {
          this.audioStatus('stop')
        }
      }
    }
  },
  methods: {
    //換路由
    routerPush(router, index) {
      this.musicShow = false
      this. musicBtnHide = false
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
      this.$store.dispatch('clock/start')
    },
    pause() {
      this.$store.dispatch('clock/pause')
    },
    stop() {
      this.$store.dispatch('clock/stop')
    },
    run() {
      this.$store.dispatch('clock/run')
    },
    //增加任務
    addTitle(value) {
      if(value.length <= 0) {
        alert("請輸入任務名稱")
        return false
      }
      const obj = {
        id: this.todoList.length,
        status: 0,
        describe: value
      }
      this.$store.commit('clock/addTodoList', obj)
      this.$store.dispatch('clock/changeTodo', this.undoList[0])
      this.title = ''
    },
    //換當前任務
    changeTitle(item) {
      this.$store.dispatch('clock/changeTodo', item)
    },
    //刪除任務
    del(item) {
      this.$store.commit('clock/delTodoList', item)
      this.$store.dispatch('clock/changeTodo', this.undoList[0])
    },

    //音樂控制
    audioStatus(type) {
      switch(type) {
        case 'play':
          this.$store.dispatch('audio/audioPlay')
          return
        case 'pause': 
          this.$store.dispatch('audio/audioPause')
          return
        case 'stop': 
          this.$store.dispatch('audio/audioStop')
          return
      }
    },
    //音量 和 進度 控制
    increment(type){
      if(type === "volume") {
        this.$store.dispatch('audio/volume', 0.2)
      }else {
        this.$store.dispatch('audio/progress', 10)
      }
    },
    decrement(type){
      if(type === "volume") {
        this.$store.dispatch('audio/volume', -0.2)
      }else {
        this.$store.dispatch('audio/progress', -10)
      }
    },
    changeSong(index) {
      //audio :key
      this.audioChangeCounter++

      this.$store.dispatch('audio/changeSong', index)
      this.$nextTick(() => this.$store.commit('audio/setAudioEl', this.$refs['audio']))
    }
  },
  mounted() {
    this.$store.dispatch('audio/changeSong', 0)
    this.$store.commit('audio/setAudioEl', this.$refs['audio'])
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

  .music {

    .musicActive {
      background: rgb(255, 176, 176);
    }
    .my-card {
      opacity: 0;
      display: none;
      transition: all 0.2s;

      &.musicShow {
        display: block;
        opacity: 1;
      }
    }
    
    position: absolute;
    border-radius: 10px;
    bottom: 10%;
    right: 25%;

    &.active {
      width: 300px;
    }

    .musicBtnHide {
      display: none;
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
