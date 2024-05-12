import {createStore} from 'vuex';
import messages from './modules/messages';
import user from './modules/user';
import socket from './modules/socket';

export default createStore({
  modules: {
    messages,
    user,
    socket
  }
});
