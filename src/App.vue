<template>
  <div id="app">
    <SelectionWheel :playercount="3" :size="300" :centerbuttonsize="50" :centerbuttonborder="20"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SelectionWheel from "./components/SelectionWheel.vue";

export default Vue.extend({
  name: "app",
  components: {
    SelectionWheel
  }
});
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
