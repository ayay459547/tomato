<template>
  <div class="container">
    <h2>Details</h2>
    <table>
      <tr>
        <th><q-icon name="calendar_today"></q-icon>日期</th>
        <th><q-icon name="done"></q-icon>完成數</th>
      </tr>
      <tr v-for="item in detailList" :key="item">
        <td>{{item[0]}}</td>
        <td>{{item[1]}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {
      
    }
  },
  computed: {
    cookieList() {
      return document.cookie.split(";");
    },
    detailList() {
      return this.cookieList.map(item => {
        let res = item.split('=')
        return res
      })
    }
  },
  mounted() {
    console.log(this.today)
  },
}
</script>

<style lang="scss" scoped>
.container {
  border-radius: 10px;
  background-color: pink;
  padding: 0 20px;
  height: 100%;

  table {
    width: 80%;
    font-size: 40px;

    tr {
      display: flex;
      justify-content: space-around;
      
      th {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
