<template>
  <div class="container" :style="{height:`${size}px`, width: `${size}px`}">
    <div
      class="pie-container"
      :style="{height:`${outerSize}px`, width: `${outerSize}px`, opacity: outerOpacity}"
    >
      <div
        v-for="index in playerCount"
        :key="index"
        class="slice"
        :style="{ 
          height: `${outerSize}px`, 
          width: `${outerSize}px`, 'clip-path': 
          `polygon(${getSlicePath(outerSize, playerCount, index).map(x => `${x[0]}px ${x[1]}px`)})`,
          opacity: outerOpacity,
          background: selectedSlice === index ? '#654321':'#123456' }"
      ></div>
    </div>
    <div
      class="center-button"
      @touchstart="expandWheel"
      @touchend="hideWheel"
      @touchmove="processDragging"
      :style="{
        top: `calc(0.5 * ${size} - ${centerbuttonsize + centerbuttonborder}px)`,
        left: `calc(0.5 * ${size} - ${centerbuttonsize + centerbuttonborder}px)`,
        height: `${centerbuttonsize}px`,
        width: `${centerbuttonsize}px`,
        border: `${centerbuttonborder}px solid white`
      }"
    ></div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import { getSlicePath, getSliceAngle, getAngleFromPoint } from "../calc/calc";

export default Vue.extend({
  name: "SelectionWheel",
  data() {
    return {
      playerCount: this.playercount,
      outerSize: 0,
      outerOpacity: 1,
      innerSize: this.centerbuttonsize,
      innerBorder: this.centerbuttonborder,
      dragging: false,
      selectedSlice: -1
    };
  },
  props: {
    playercount: Number,
    size: Number,
    centerbuttonsize: Number,
    centerbuttonborder: Number,
  },
  methods: {
    getSlicePath(
      size: number,
      sliceCount: number,
      sliceIndex: number
    ): number[][] {
      return getSlicePath(size, sliceCount, sliceIndex);
    },
    expandWheel():void {
      this.outerSize = this.size;
      this.outerOpacity = 1;
    },
    hideWheel():void {
      this.dragging = false;
      this.selectedSlice = -1;
      this.outerSize = 0;
      this.outerOpacity = 0;
    },
    processDragging(e: any):void {
      this.dragging = true;

      this.selectedSlice = this.getSelectedSlice(
        e.targetTouches[0].clientX,
        e.targetTouches[0].clientY
      );
    },
    getSelectedSlice(x: number, y: number):number {
      let angle = Math.round(getAngleFromPoint(this.outerSize / 2, x, y));
      let anglePerSlice = 360 / this.playercount;

      return Math.floor(angle / anglePerSlice);
    }
  }
});
</script>

<style scoped lang="scss">
.container {
  border-radius: 100%;
  position: relative;
  overflow: hidden;

  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.pie-container {
  transition: all 0.2s;
  opacity: 0;
  height: 0;
  width: 0;

  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.slice {
  position: absolute;
  transition: all 0.2s;
}

.center-button {
  position: absolute;
  background: rgb(122, 6, 6);
  border-radius: 100%;
}
</style>
