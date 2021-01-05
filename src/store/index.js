import Vuex from 'vuex'
import Vue from 'vue'
import Axios from 'axios'

Vue.use(Vuex)

export const createStore = () => { 
  return new Vuex.Store({
    state: () => ({
      posts: []
    }),
    mutations: {
      setPosts(state, data) {
        state.posts = data
      }
    },
    actions: {
      // 在服务器渲染器件务必让actions返回一个Promise
      async getPosts({ commit }) { 
        const { data } = await Axios.get('https://cnodejs.org/api/v1/topics')
        commit('setPosts', data.data)
      }
    }
  })
}