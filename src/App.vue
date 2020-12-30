<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <h2>客户端动态交互</h2>
    <div>
      <input v-model="message"/>
    </div>
    <div>
      <button @click="onClick">点击测试</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      message: '插值表达式'
    }
  },
  methods: {
    onClick () {
      console.log('Hello world')
    }
  }
}
</script>
<style scoped>

</style>