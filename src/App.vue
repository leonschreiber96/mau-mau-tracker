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
    <!-- <SelectionWheel
      :playercount="4"
      :size="300"
      :centerbuttonsize="50"
      :centerbuttonborder="20"
      @selection="selection"
    />
    <SelectionWheel
      :playercount="5"
      :size="300"
      :centerbuttonsize="50"
      :centerbuttonborder="20"
      @selection="selection"
    />
    <SelectionWheel
      :playercount="6"
      :size="300"
      :centerbuttonsize="50"
      :centerbuttonborder="20"
      @selection="selection"
    />
    <SelectionWheel
      :playercount="10"
      :size="600"
      :centerbuttonsize="10"
      :centerbuttonborder="50"
      @selection="selection"
    />-->
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
  display: flex;
}
</style>
