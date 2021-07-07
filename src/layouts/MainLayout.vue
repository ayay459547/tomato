<template>
  <div class="container" :class="{'bg-blue': isBgBlue}">
    <div class="row">
      <div class="col-9" @click.stop="routerPush('timing', 0)">
        <h4 v-show="!isShow && !isBgBlue">當前任務 : {{titleList[currTitle]}}</h4>
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
          <h4 v-if="!titleList.length" style="opacity:0.4">沒有任務</h4>
          <q-scroll-area v-else style="height: 100%; width: 100%">
            <ul v-show="!isBgBlue">
              <li v-for="(item, index) in titleList" 
                :key="item"
                :class="{border:currTitle === index}"
                @click.stop="changeTitle(index)">
                <q-icon name="alarm"></q-icon>
                {{item}}
                <q-btn icon="delete" @click.stop="del(index)" round></q-btn>
              </li>
            </ul>
          </q-scroll-area>
          
        </div>

        <div class="alarm">
          {{min}}:{{sec}}
        </div>
        <q-btn style="width: 150px" @click="start" class="btn" icon="play_arrow">start</q-btn>
        <!-- <q-btn v-show="!isBgBlue && !isShow && isPause" style="width: 150px" @click="start" class="btn" icon="play_arrow">start</q-btn>         -->
        <q-btn style="width: 150px" @click="done" class="btn" icon="play_arrow">skip</q-btn>
        <q-btn style="width: 150px" @click="pause" class="btn" icon="pause">pause</q-btn>
        <q-btn @click="reset" style="width: 150px" class="btn" icon="restart_alt">newStart</q-btn>
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
// import TimingControls from "boot/timingControls"

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
      currTitle: 0,
      count:0,
      titleList: [],
      isShow: true,
      timer: null,
      isBgBlue: false,
      isDone: false,
      audioUrl: "",
      isPause:true,
      audioChangeCounter: 0,
      routerAcitve: false,
      // timingControls: new TimingControls(this.$store)
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
      return this.$store.state.timing
    },
    today() {
      let date = new Date()
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  },
  watch: {
    alarm: function(newValue){
      // if(oddValue == 0 && newValue == -1) {
      //   this.done()
      // }
      if(newValue <= -1) {
        this.$store.commit('setTime', 0)
      }
    }
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
    async start() {
      // this.timingControls.pause()
      this.$store.commit('pause')
      if(this.titleList.length <= 0) {
        if(this.count % 2 === 0) {
          alert("沒有任務")
          return false
        }
      }
      this.isShow = false
      this.isPause = !this.isPause
      this.pause()

    
      // let test = await this.$store.commit('start')
      // test.then(res => {
      //   console.log(res)
      // })

      await this.$store.commit('start')
      
      setTimeout(() => {
        this.done()
      }, (this.$store.state.timing + 1) * 1000)

    },
    //計時結束
    async done() {
      if(this.count%2 === 0) {
        //休息
        this.count++
        this.isBgBlue = true
        
        //將未完成 移至 完成列表 
        this.$store.commit('addSuccess',this.titleList[this.currTitle])
        this.titleList.splice(this.currTitle,1)
        document.cookie = `${this.today} = ${this.$store.state.successList.length}; expires = ${6 * 24 * 60 * 60 * 1000}`

        // this.timingControls.setTime(this.$store.state.rest)
        this.$store.commit('setTime', this.$store.state.rest)
        // this.$store.commit('pause')

        
        this.pause()   
        // this.$store.commit('start')
        // await this.start()
        setTimeout(() => {
          this.start()
        },0)
        
      }else {
        //非休息
        this.count++
        this.isBgBlue = false
        // this.timingControls.setTime(this.$store.state.work)
        // this.pause()
        this.$store.commit('setTime', this.$store.state.work)
      }
      this.isShow = !this.isShow
      // this.timingControls.pause()
      this.$store.commit('pause')
    },
    //暫停時間
    pause() {
      console.log('pause')
      this.isPause = !this.isPause
      // this.timingControls.pause()
      this.$store.commit('pause')
    },
    //重設計時
    reset() {
      this.isShow = true
      this.isBgBlue = false
      // this.timingControls.pause()
      // this.timingControls.setTime(this.$store.state.work)
      this.$store.commit('pause')
      this.$store.commit('setTime', this.$store.state.work)
    },
    //增加任務
    addTitle(value) {
      if(value.length <= 0) {
        alert("請輸入任務名稱")
        return false
      }
      this.titleList.push(value)
      this.title = ''
    },
    //換當前任務
    changeTitle(index) {
      this.currTitle = index
    },
    //刪除任務
    del(index) {
      this.titleList.splice(index, 1)
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
