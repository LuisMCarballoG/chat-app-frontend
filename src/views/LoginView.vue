<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="username-input" class="form-label">{{ $t('login.username') }}</label>
                <input type="text" class="form-control" id="username-input" v-model="username" required>
              </div>
              <button type="submit" class="btn btn-primary">{{ $t('login.login') }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: ''
    };
  },
  methods: {
    login() {
      this.$store.dispatch('user/loginUser', this.username);
      this.$router.push('/chat');
    }
  }
};
</script>
