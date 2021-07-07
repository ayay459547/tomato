<template>
  <div class="contaienr">
    <h2>Done({{logList.length}})</h2>
    <q-scroll-area style="height: 75%; width: 100%;">
      <ul>
        <li v-for="(item, index) in logList" :key="item">
          {{item}}
          <q-btn @click="del(index)" round icon="delete"></q-btn>
        </li>
      </ul>
    </q-scroll-area>
    
  </div>
</template>

<script>
export default {
  name: "Log",
  computed: {
    logList() {
      return this.$store.state.successList
    }
  },
  methods: {
    del(index) {
      this.$store.commit('delSuccess', index)
    }
  },
}
</script>

<style lang="scss" scoped>
.contaienr {
  padding: 0 20px;
  width: 90%;
  user-select: none;
  
  ul {
    width: 100%;
    height: 75%;
    list-style: none;
    width: 100%;
    
    li {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      font-size: 30px;
    }
  }
}
</style>
