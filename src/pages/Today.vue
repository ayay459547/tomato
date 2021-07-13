<template>
  <div class="contaienr">
    <h2>Done({{logList.length}})</h2>
    <q-scroll-area style="height: 75%; width: 100%;">
      <ul>
        <li v-for="item in logList" :key="item.id">
          {{item.describe}}
          <q-btn @click="del(item)" round icon="delete"></q-btn>
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
      return this.$store.getters['clock/completed']
    }
  },
  methods: {
    del(item) {
      this.$store.commit('clock/delTodoList', item)
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
