import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showLoginRegister: false
  },
  mutations: {
    change(state, showLoginRegister) {
      state.showLoginRegister = showLoginRegister;
    }
  },
  getters: {
    showLoginRegister: state => state.showLoginRegister
  }
});
