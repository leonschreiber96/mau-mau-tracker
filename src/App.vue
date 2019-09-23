<template>
  <div id="app">
    <SelectionWheel
      :playercount="3"
      :size="300"
      :centerbuttonsize="50"
      :centerbuttonborder="20"
      @selection="selection"
    />
    <div>{{selectedSlice}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SelectionWheel from "./components/SelectionWheel.vue";

export default Vue.extend({
  name: "app",
  components: {
    SelectionWheel
  },
  data() {
    return {
      selectedSlice: -1
    };
  },
  methods: {
    selection(selectedSlice: number): void {
      this.selectedSlice = selectedSlice;
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
