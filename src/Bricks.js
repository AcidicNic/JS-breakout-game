import Brick from './Brick.js';

class Bricks {
  constructor(rows = 3, cols = 6, height = 20, width = 60, padding = 10,
    marginX = 35, marginY = 30,
    colors = ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#3498DB', '#9B59B6']
  ) {
    this.r = rows; // number of rows
    this.c = cols; // number of columns
    this.h = height; // brick height
    this.w = width; // brick width
    this.p = padding; // padding
    this.mx = marginX; // margin on the x axis
    this.my = marginY; // margin on the y axis
    this.colors = colors; // array of colors

    this.bricks = this._createBricks(); // array of brick objects
  }

  _createBricks() {
    const bricks = Array(this.c);

    for (let c = 0; c < this.c; c += 1) {
      bricks[c] = Array(this.r);

      for (let r = 0; r < this.r; r += 1) {
        bricks[c][r] = new Brick(
          (c * (this.w + this.p)) + this.mx,
          (r * (this.h + this.p)) + this.my,
          this.w,
          this.h,
          this.colors[c % this.colors.length],
        );
      }
    }

    return bricks;
  }

  render(ctx) {
    this.bricks.forEach( row => row.forEach( brick => {
      if (brick.status) {
        brick.render(ctx);
      }
    }));
  }
}

export default Bricks;

// rows: 3,
// cols: 6,
// h: 20, // height
// w: 60, // width
// padding: 10,
// mx: 35, // margin x
// my: 30, // margin y
// colors: ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#3498DB', '#9B59B6'],
