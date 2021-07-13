<template>
  <div class="container">
    <h2>SetTime</h2>
    <h4>Minute : 
      <q-input v-model="min" type="number" class="input" filled :dense="dense" />
    </h4>
    <h4>Second : 
      <q-input v-model="sec" type="number" class="input" filled :dense="dense" />
    </h4>
    <q-btn class="btn" icon="" @click="toggle">確定</q-btn>
  </div>
</template>

<script>
export default {
  name: "SetTimes",
  data() {
    return {
      min: 0,
      sec: 0
    }
  },
  computed: {
    timing() {
      return parseInt(this.min) * 60 + parseInt(this.sec)
    }
  },
  methods: {
    toggle() {
      this.$store.commit('clock/setTimine', this.timing)
      this.$emit("SetTimeClose")
    }
  },
  mounted() {
    this.min = parseInt(this.$store.state.clock.timine / 60)
    this.sec = parseInt(this.$store.state.clock.timine % 60)
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 90%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: pink;
  padding: 0 20px;
  height: 100%;
  user-select: none;
  .input,
  .btn {
    width: 80%;
  }
}
</style>
