<template>
  <div
    ref="selectionwheel"
    class="container"
    :style="{height:`${size}px`, width: `${size}px`, zIndex: inFront}"
  >
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
          fontSize: '50px',
          color: 'red'
          }"
      >
        {{index}}
        <img
          :style="{
            height: `${outerSize / 2}px`,
            width: `${outerSize / 2}px`,
            top: `${getImagePosition(index).y}px`,
            left: `${getImagePosition(index).x}px`
          }"
          class="profile-img"
          src="https://static1.businessinsider.com/image/528d41f76bb3f7d71051e27f/when-hiring-always-ask-yourself-where-can-this-person-go-from-here.jpg"
        />
      </div>
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
// background: selectedSlice === index ?
//           'url(https://static1.businessinsider.com/image/528d41f76bb3f7d71051e27f/when-hiring-always-ask-yourself-where-can-this-person-go-from-here.jpg)':
//           '#123456'
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
      coordinateCenter: 0,
      inFront: 0,
      radius: this.size / 2
    };
  },
  props: {
    playercount: Number,
    size: Number,
    centerbuttonsize: Number,
    centerbuttonborder: Number
  },
  methods: {
    getImagePosition(sliceIndex: number, show: number): Point {
      let angles: Angle[] = this.getSliceAngles(sliceIndex);

      console.log(angles);

      let centerAngle: Angle = angles[1];

      let point: Point = getPointForAngle(centerAngle, this.radius / 2);

      let relX = point.x + this.radius;
      // let relY = point.y >= 0 ? this.radius - point.y : this.radius - point.y;
      let relY = this.radius - point.y;
      // console.log(centerAngle);
      // console.log("slice " + sliceIndex + ": " + point.x + " " + point.y);

      return new Point(relX, relY);
    },
    toComponentCoordinates(x: number, y: number): any {
      let component = this.$refs.selectionwheel as HTMLElement;

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
      let origin: number[] = [this.radius, this.radius];

      let angles: Angle[] = this.getSliceAngles(sliceIndex);

      let firstAngle: Angle = angles[0];
      let centerAngle: Angle = angles[1];
      let secondAngle: Angle = angles[2];

      let firstPoint: Point = getPointForAngle(firstAngle, this.radius);
      let secondPoint: Point = getPointForAngle(secondAngle, this.radius);
      let centerPoint: Point = getPointForAngle(
        centerAngle,
        this.radius * 2,
        this.radius
      );

      let target: number[] = [firstPoint.x, firstPoint.y];
      let center: number[] = [centerPoint.x, centerPoint.y];
      let nextTarget: number[] = [secondPoint.x, secondPoint.y];

      return [origin, target, center, nextTarget];
    },
    getSliceAngles(sliceIndex: number): Angle[] {
      let firstAngle: Angle = new Angle(
        sliceIndex * ((2 * pi) / this.playerCount)
      );

      let secondAngle: Angle = new Angle(
        (sliceIndex + 1) * ((2 * pi) / this.playerCount) - pi / 32
      );

      let centerAngle: Angle = new Angle(firstAngle.add(secondAngle).rad / 2);

      return [firstAngle, centerAngle, secondAngle];
    },
    expandWheel(): void {
      this.outerSize = this.size;
      this.outerOpacity = 1;
      this.inFront = 1;
    },
    hideWheel(): void {
      this.dragging = false;
      this.$emit("selection", this.selectedSlice);
      this.selectedSlice = -1;
      this.outerSize = 0;
      this.outerOpacity = 0;
      this.inFront = 0;
    },
    processDragging(e: any): void {
      this.dragging = true;

      let coordinates = this.toComponentCoordinates(e.x, e.y);

      console.log(getAngleForPoint(coordinates));

      this.selectedSlice = this.getSelectedSlice(coordinates.x, coordinates.y);
    },
    getSelectedSlice(x: number, y: number): number {
      let angle: Angle = getAngleForPoint(new Point(x, -y));
      let anglePerSlice: Angle = new Angle((2 * pi) / this.playercount);

      return Math.ceil(angle.deg / anglePerSlice.deg);
    }
  }
});
</script>

<style scoped lang="scss">
.container {
  position: relative;

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

  position: fixed;
  border-radius: 100%;
  overflow: hidden;
}

.slice {
  position: absolute;
  transition: all 0.1s;
  object-fit: fill;
  background-color: #123456;
  /* background-image: url("https://static1.businessinsider.com/image/528d41f76bb3f7d71051e27f/when-hiring-always-ask-yourself-where-can-this-person-go-from-here.jpg"); */
}

.center-button {
  position: absolute;
  background: rgb(122, 6, 6);
  border-radius: 100%;
  touch-action: none;
}

.profile-img {
  position: absolute;
}
</style>
