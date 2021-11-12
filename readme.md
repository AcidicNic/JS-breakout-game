# [JavaScript Breakout Game](https://nicc.io/brick-game)

## How to lint & bundle
- ```eslint src/BrickGame.js``` ~ to run the linter on the JS in /src/
- ```npm run build``` ~ to bundle all of the js into /dist/BrickGame-bundle.js

---

## Setup

1. Setup the canvas in your HTML.
```html
<canvas id="brickGame" width="480" height="320"></canvas>
```

2. Import the JS in the bottom of your body tag.
```html
<script type="module" src="dist/BrickGame-bundle.js"></script>
```
