<template>
  <div :class="isCurrentUser ? 'justify-content-end' : 'justify-content-start'" class="d-flex" data-id="{{ message._id }}">
    <div class="w-auto alert py-0" :class="isCurrentUser ? 'alert-info' : 'alert-primary'" :style="{ maxWidth: '60%' }">
      <div class="text-start fw-bold" :hidden="isCurrentUser" :style="{ color: userColor }" style="font-size: 0.8rem;">~ {{ message.username }}</div>
      <div class="text-start pe-4">
        <div v-if="message.fileContent">
          <a :href="message.fileContent" :download="message.fileName">
            <img v-if="isImage(message.fileType)" :src="message.fileContent" alt="Imagen enviada" style="max-width: 200px; max-height: 200px;">
            <span v-else>{{ getIcon(message.fileType) }}</span>
          </a>
        </div>
      </div>
      <div v-if="isCurrentUser && isEditing" class="input-group">
        <input v-model="editableText" class="form-control form-control-sm" @cancel="cancelEdit">
        <button class="btn btn-sm btn-success" @click="saveEdit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
        <button class="btn btn-sm btn-danger" @click="cancelEdit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      </div>
      <div v-else>
        <span @click="enableEdit" v-html="highlightedMessage"></span>
      </div>
      <div class="text-end text-muted px-0" style="font-size: 0.65rem;">{{ formattedTimestamp }}</div>
    </div>
    <div class="text-end" :hidden="!isCurrentUser">
      <button v-if="isCurrentUser" @click="deleteMessage(message._id)" class="btn btn-danger btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4" style="width: 12px; height: 12px;">
          <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
  import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
  import { mapState } from 'vuex';

  export default {
    props: {
      message: Object,
      isCurrentUser: Boolean,
      highlightedMessage: String,
    },
    computed: {
      ...mapState('messages', ['userColors']),
      formattedTimestamp() {
        const timestamp = new Date(this.message.timestamp);
        return this.formatTimestamp(timestamp);
      },
      userColor() {
        return this.userColors[this.message.username] || '#000';
      }
    },
    data() {
      return {
        isEditing: false,
        editableText: this.message.message
      };
    },
    methods: {
      enableEdit() {
        this.isEditing = true;
      },
      cancelEdit() {
        this.isEditing = false;
        this.editableText = this.message.message;
      },
      saveEdit() {
        this.$emit('editMessage', { messageId: this.message._id, newText: this.editableText });
        this.isEditing = false;
      },
      deleteMessage() {
        this.$emit('deleteMessage', this.message._id);
      },
      formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          return '';
        }

        if (isToday(timestamp)) {
          return format(timestamp, 'HH:mm');
        } else if (isYesterday(timestamp)) {
          return `Ayer ${format(timestamp, 'HH:mm')}`;
        } else if (isThisWeek(timestamp)) {
          return `${format(timestamp, 'EEEE - HH:mm')}`;
        } else if (isThisYear(timestamp)) {
          return `${format(timestamp, 'dd MMMM - HH:mm')}`;
        } else {
          return format(timestamp, 'dd MMMM yyyy - HH:mm');
        }
      },
      isImage(fileType) {
        return typeof fileType === 'string' && fileType.includes('image/');
      },
      getIcon() {
        let fileType = this.message.fileType;
        let icon = '📄';

        if (fileType === 'application/pdf') {
          icon = '📄';
        } else if (fileType.includes('excel') || fileType.includes('spreadsheetml')) {
          icon = '📊';
        }

        return icon + ' ' + this.message.fileName;
      }
    }
  };
</script>
