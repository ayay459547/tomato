<template>
  <div class="container">
    <h2>Music</h2>
    <div class="musicList">
      <ul>
        <li v-for="(item, index) in musicList" 
          :key="item.name"
          :class="{active:current === index}"
          @click="changeSong(index)">{{item.name}}</li>
      </ul>
    </div>

    <!-- <audio class="audio" :key="audioChangeCounter" controls autoplay loop>
      <source :src="audioUrl">
    </audio> -->

    <!-- <audio class="audio" loop controls @ended="handleNext">
      <source src="../assets/music/song5.mp3">
    </audio> -->

    <div class="controls">
      <q-btn icon="fast_rewind" @click="decrement('progress', 0.1)"></q-btn>
      <q-btn icon="fast_forward" @click="increment('progress', 0.1)"></q-btn>

      <q-btn icon="volume_down" @click="decrement('volume', 10)"></q-btn>
      <q-btn icon="volume_up" @click="increment('volume', 10)"></q-btn>

      <q-btn icon="music_note" @click="play" v-show="!audioPlay">play</q-btn>
      <q-btn icon="pause" @click="pause" v-show="audioPlay">pause</q-btn>
      <q-btn icon="stop" @click="stop">stop</q-btn>

      <!-- <button @click="console.log(number)">add</button> -->
    </div>
  </div>
</template>

<script>
import bus from "boot/bus"
import AudioControls from 'boot/audioControls'

export default {
  name: "Music",
  inject: ["changeSong",'number'],
  data(){
    return {
      audioPlay: false,
      current: 0,
      audioChangeCounter: 0,
      audioControls: null,
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
      audioEl: null
    }
  },
  computed: {
    audioUrl() {
      return this.musicList[this.current].src
    }
  },
  methods: {
    changeSong(index) {
      this.audioPlay = true
      this.current = index
      this.audioChangeCounter++
      this.audioEl = 

      bus.emit("changeSong",{
        url: this.audioUrl,
        count: this.audioChangeCounter
      })
    },
    play(){
      this.audioPlay = true
      AudioControls(".audio").status('play')
    },
    pause(){
      this.audioPlay = false
      AudioControls(".audio").status('pause')
    },
    stop(){
      this.audioPlay = false
      AudioControls(".audio").status('stop')
    },

    //音量 和 進度 控制
    increment(type){
      if(type === "volume") {
        AudioControls(".audio").volume(0.2)
      }else {
        AudioControls(".audio").progress(10)
      }
    },
    decrement(type){
      if(type === "volume") {
        AudioControls(".audio").volume(-0.2)
      }else {
        AudioControls(".audio").progress(-10)
      }
    }
  },
  mounted() {
    // console.log(this.getAudioElement().changeAudioStatus('stop'))
    this.changeSong(0)
  }
}
</script>

<style lang="scss" scoped>
.container {
  border-radius: 10px;
  background-color: pink;
  padding: 0 20px;
  height: 95%;
  width: 95%;
  position: relative;
  user-select: none;
  ul {
    list-style: none;
    li {
      font-size: 30px;
      border-radius: 20px;
      margin: 10px 0 10px -20px;
      padding: 10px 30px;

      &.active {
        background-color: rgb(255, 161, 177);
      }
    }
  }

  .controls {
    position: absolute;
    bottom: 0;
  }
}
</style>
