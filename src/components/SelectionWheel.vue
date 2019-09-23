<template>
  <div id="selection-wheel" class="container" :style="{height:`${size}px`, width: `${size}px`}">
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
          width: `${outerSize}px`,
          'clip-path':   `polygon(${getSlicePath(index - 1).map(x => `${x[0]}px ${x[1]}px`)})`,
          opacity: outerOpacity,
          background: selectedSlice === index ? '#654321':'#123456' }"
      ></div>
    </div>
    <div
      class="center-button"
      @pointerdown="expandWheel"
      @pointerup="hideWheel"
      @pointermove="processDragging"
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
import {
  pi,
  Angle,
  Point,
  AngleType,
  getSliceAngle,
  getAngleForPoint,
  getPointForAngle
} from "../calc/calc";

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
      selectedSlice: -1,
      coordinateCenter: 0
    };
  },
  props: {
    playercount: Number,
    size: Number,
    centerbuttonsize: Number,
    centerbuttonborder: Number
  },
  methods: {
    toComponentCoordinates(x: number, y: number): any {
      let component = document.getElementById("selection-wheel");

      if (component) {
        let position = component.getBoundingClientRect();

        let relativeX = -Math.round(position.left + position.width / 2 - x);
        let relativeY = Math.round(position.top + position.height / 2 - y);

        return {
          x: relativeX,
          y: relativeY
        };
      }
    },
    getSlicePath(sliceIndex: number): number[][] {
      let radius: number = this.size / 2;
      let origin: number[] = [radius, radius];

      let firstAngle: Angle = new Angle(
        sliceIndex * ((2 * pi) / this.playerCount)
      );

      let secondAngle: Angle = new Angle(
        (sliceIndex + 1) * ((2 * pi) / this.playerCount)
      );

      let centerAngle: Angle = new Angle(firstAngle.add(secondAngle).rad / 2);

      let firstPoint: Point = getPointForAngle(firstAngle, radius);
      let secondPoint: Point = getPointForAngle(secondAngle, radius);
      let centerPoint: Point = getPointForAngle(
        centerAngle,
        radius * 2,
        radius
      );

      let target: number[] = [firstPoint.x, firstPoint.y];
      let center: number[] = [centerPoint.x, centerPoint.y];
      let nextTarget: number[] = [secondPoint.x, secondPoint.y];

      return [origin, target, center, nextTarget];
    },
    expandWheel(): void {
      this.outerSize = this.size;
      this.outerOpacity = 1;
    },
    hideWheel(): void {
      this.dragging = false;
      this.$emit("selection", this.selectedSlice);
      this.selectedSlice = -1;
      this.outerSize = 0;
      this.outerOpacity = 0;
    },
    processDragging(e: any): void {
      this.dragging = true;

      let coordinates = this.toComponentCoordinates(e.x, e.y);

      this.selectedSlice = this.getSelectedSlice(coordinates.x, coordinates.y);
    },
    getSelectedSlice(x: number, y: number): number {
      let angle: Angle = getAngleForPoint(new Point(x, -y));
      let anglePerSlice: Angle = new Angle((2 * pi) / this.playercount);

      console.log(new Point(x, -y));
      console.log(angle);
      console.log(
        angle.deg +
          " / " +
          anglePerSlice.deg +
          " = " +
          angle.deg / anglePerSlice.deg
      );
      console.log(" ");

      return Math.ceil(angle.deg / anglePerSlice.deg);
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
  transition: all 0.1s;
}

.center-button {
  position: absolute;
  background: rgb(122, 6, 6);
  border-radius: 100%;
  touch-action: none;
}
</style>
