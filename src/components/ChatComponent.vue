<template>
  <div class="row vh-100 py-5">
    <div class="col-md-12 h-75">
      <div class="card h-100">
        <div class="card-header text-center">
          {{ $t('chat.appTitle') }}
          <span v-if="!isConnected" class="badge bg-danger">{{ $t('chat.offline') }}</span>
          <span v-else class="badge bg-success">{{ $t('chat.online') }}</span>
          <div class="col-12 d-flex align-items-center">
            <input type="text" class="form-control form-control-sm" :placeholder="$t('chat.searchMessages')" v-model="searchQuery">
            <button class="btn btn-sm btn-danger ml-2" @click="confirmDeleteAll" :title="$t('chat.dropAllMyMessages')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"  style="width: 18px; height: 18px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
        <div class="card-body d-flex flex-column overflow-auto">
          <div class="flex-grow-1 overflow-auto pe-3" ref="messageContainer">
            <message-component
                v-for="msg in this.$store.state.messages.messages"
                :key="msg.id"
                :message="msg"
                :isCurrentUser="msg.username === this.$store.state.user.currentUser"
                :highlightedMessage="highlightMatches(msg.message)"
                @deleteMessage="handleDeleteMessage"
                @editMessage="handleEditMessage"
            />
          </div>
        </div>
        <div class="card-footer" :hidden="!isConnected">
          <div class="input-group">
            <button @click="triggerFileInput" :class="['btn', selectedFile ? 'btn-success' : 'btn-secondary']">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
            </button>
            <input type="file" @change="handleFileUpload" class="d-none" ref="fileInput">
            <input type="text" class="form-control" v-model="newMessage" :placeholder="$t('chat.typeMessage')" :disabled="!isConnected" @keyup.enter="sendMessage">
            <button v-if="selectedFile || newMessage" class="btn btn-danger" @click="clearFileSelection">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
              </svg>
            </button>
            <button class="btn btn-primary" @click="sendMessage" :disabled="newMessage.trim() === '' && !selectedFile">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MessageComponent from './MessageComponent';

  export default {
    components: {
      MessageComponent
    },
    data() {
      return {
        newMessage: '',
        searchQuery: '',
        selectedFile: null,
      };
    },
    computed: {
      isConnected() {
        return this.$store.state.socket.isConnected;
      }
    },
    methods: {
      confirmDeleteAll() {
        const message = this.$t('chat.deleteAllMessages');
        if (confirm(message)) {
          this.$store.dispatch('messages/deleteAllMessages', this.$store.state.user.currentUser);
        }
      },
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      clearFileSelection() {
        this.selectedFile = null;
        this.newMessage = '';
        this.$refs.fileInput.value = '';
        this.$refs.messageContainer.value = '';
      },
      sendMessage() {
        let message = {
          username: this.$store.state.user.currentUser,
          message: this.newMessage.trim(),
          timestamp: new Date(),
          fileType: this.selectedFile ? this.selectedFile.type : null,
          fileName: this.selectedFile ? this.selectedFile.name : null
        };

        if (this.selectedFile) {
          const reader = new FileReader();
          reader.onload = (e) => {
            message.fileContent = e.target.result;
            this.$store.dispatch('messages/sendMessage', message);
            this.resetAfterSend();
          };
          reader.readAsDataURL(this.selectedFile);
        } else if (this.newMessage.trim() !== '') {
          this.$store.dispatch('messages/sendMessage', message);
          this.resetAfterSend();
        }
      },
      resetAfterSend() {
        this.newMessage = '';
        this.selectedFile = null;
        this.$refs.fileInput.value = '';
        this.scrollToBottom();
      },
      highlightMatches(text) {
        if (!this.searchQuery.trim() || !text) return text;
        const regex = new RegExp(this.searchQuery, 'gi');
        return text.replace(regex, match => `<span class="bg-warning">${match}</span>`);
      },
      scrollToBottom() {
        this.$nextTick(() => {
          setTimeout(() => {
            const container = this.$refs.messageContainer;
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }, 100);
        });
      },
      handleDeleteMessage(messageId) {
        this.$store.dispatch('messages/deleteMessage', messageId);
      },
      handleEditMessage(data) {
        this.$store.dispatch('messages/editMessage', data);
      },
    },
    mounted() {
      this.scrollToBottom();
    },
  };
</script>
