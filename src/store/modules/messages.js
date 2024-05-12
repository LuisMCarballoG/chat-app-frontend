const state = () => ({
  messages: [],
  userColors: {}
});

const mutations = {
  initializeMessages(state, messages) {
    state.messages = messages;
    messages.forEach(msg => {
      if (!state.userColors[msg.username]) {
        state.userColors[msg.username] = generateRandomColor();
      }
    });
  },
  addMessage(state, message) {
    state.messages.push(message.message);
    if (!state.userColors[message.username]) {
      state.userColors[message.username] = generateRandomColor();
    }
  },
  updateMessage(state, updatedMessage) {
    const index = state.messages.findIndex(msg => msg._id === updatedMessage._id);
    if (index !== -1) {
      state.messages[index] = updatedMessage;
    }
  },
  removeMessage(state, messageId) {
    state.messages = state.messages.filter(msg => msg._id !== messageId);
  },
  removeUserMessages(state, username) {
    state.messages = state.messages.filter(msg => msg.username !== username);
  },
};

const actions = {
  sendMessage({rootState}, message) {
    rootState.socket.socket.emit('message', message);
  },
  editMessage({rootState}, data) {
    rootState.socket.socket.emit('editMessage', data);
  },
  deleteMessage({rootState}, messageId) {
    rootState.socket.socket.emit('deleteMessage', messageId);
  },
  deleteAllMessages({rootState}, username) {
    rootState.socket.socket.emit('deleteAllMessages', {username});
  },
};

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 75 + Math.floor(Math.random() * 25);
  const lightness = 35 + Math.floor(Math.random() * 5);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
