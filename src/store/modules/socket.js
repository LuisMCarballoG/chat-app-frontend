import {io} from 'socket.io-client';

const state = () => ({
  socket: null,
  isConnected: false
});

const mutations = {
  setSocket(state, socket) {
    state.socket = socket;
  },
  setConnectionStatus(state, status) {
    state.isConnected = status;
  },
};

const actions = {
  initializeWebSocket({commit}) {
    const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

    commit('setSocket', socket);

    socket.on('connect', () => {
      commit('setConnectionStatus', true);
    });

    socket.on('init', data => {
      commit('messages/initializeMessages', data.messages, {root: true});
    });

    socket.on('message', message => {
      commit('messages/addMessage', message, {root: true});
    });

    socket.on('messageUpdated', updatedMessage => {
      commit('messages/updateMessage', updatedMessage, {root: true});
    });

    socket.on('messageDeleted', ({messageId}) => {
      commit('messages/removeMessage', messageId, {root: true});
    });

    socket.on('userMessagesDeleted', ({username}) => {
      commit('messages/removeUserMessages', username, {root: true});
    });

    socket.on('disconnect', () => {
      commit('setConnectionStatus', false);
    });
  }
};

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
};
