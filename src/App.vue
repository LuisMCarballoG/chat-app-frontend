<template>
  <div id="app">
    <select class="form-select form-select-sm w-auto float-end bg-warning" @change="setLanguage($event.target.value)">
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    setLanguage(lang) {
      this.$i18n.locale = lang;
    }
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
