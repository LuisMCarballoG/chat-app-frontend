const state = () => ({
  currentUser: null
});

const mutations = {
  setUser(state, user) {
    state.currentUser = user;
  }
};

const actions = {
  loginUser({commit}, user) {
    commit('setUser', user);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
