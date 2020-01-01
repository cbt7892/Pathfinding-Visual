var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var holdingDownMouse = false;

var movesArray = [];
var bestPath = [];

var startRow = 1;
var startColumn = 1;
var endRow = 28;
var endColumn = 28;

var gridDimension = 30;

var verticalSpacing = innerHeight / gridDimension;
var horizontalSpacing = innerWidth / gridDimension;

var black = "#000000";
var green = "#00FF00";
var white = "#FFFFFF";
var red = "#FF0000";
var blue = "#0000FF";

document.addEventListener("mousedown", e => {
  if (holdingDownMouse) {
    holdingDownMouse = false;
    var ret = BFS(startRow, startColumn, endRow, endColumn);
    movesArray = ret[0];
    bestPath = ret[1];
    animateBFS();
  }
  else holdingDownMouse = true;
});

document.addEventListener("mousemove", e => {
  if (holdingDownMouse) {
    fillCell(e.clientX, e.clientY, black);
    isBlocked[yPixelToCell(e.clientY)][xPixelToCell(e.clientX)] = true;
  }
});

var isBlocked = new Array(gridDimension);
for (var i = 0; i < gridDimension; i++) {
  isBlocked[i] = new Array(gridDimension);
  for (var j = 0; j < gridDimension; j++) {
    isBlocked[i][j] = false;
  }
}

function drawGrid(numLines) {
  for (var i = 1; i <= numLines; i++) {
    c.beginPath();
    var y = verticalSpacing * i;
    var x = horizontalSpacing * i;
    c.moveTo(x, 0);
    c.lineTo(x, innerHeight);
    c.moveTo(0, y);
    c.lineTo(innerWidth, y);
    c.stroke();
    c.closePath();
  }
}

function xCellToPixel(x) {
  return x * horizontalSpacing;
}

function xPixelToCell(x) {
  return Math.floor((x + 1) / horizontalSpacing);
}

function yCellToPixel(y) {
  return y * verticalSpacing;
}

function yPixelToCell(y) {
  return Math.floor((y + 1) / verticalSpacing);
}

function fillCell(xPixel, yPixel, color) {
  c.beginPath();
  if (xPixel == innerWidth) {
    xPixel--;
  }
  if (yPixel == innerHeight) {
    yPixel--;
  }
  var xCell = xPixelToCell(xPixel);
  var yCell = yPixelToCell(yPixel);
  c.fillStyle = color;
  c.fillRect(xCellToPixel(xCell), yCellToPixel(yCell), horizontalSpacing, verticalSpacing);
  c.closePath();
}

function BFS(rStart, cStart, rFinish, cFinish) {
  var allSteps = [];
  var visited = new Array(gridDimension);
  for (var i = 0; i < gridDimension; i++) {
    visited[i] = new Array(gridDimension);
    for (var j = 0; j < gridDimension; j++) {
      visited[i][j] = false;
    }
  }
  var dx = [1, -1, 0, 0];
  var dy = [0, 0, 1, -1];
  var q = [];
  q.push([[rStart, cStart], [[1, 1]]]);
  visited[rStart][cStart] = true;
  while (q.length != 0 && !visited[rFinish][cFinish]) {
    var r = q[0][0][0];
    var c = q[0][0][1];
    var path = q[0][1];
    q.shift();
    allSteps.push([r, c]);
    for (var i = 0; i < 4; i++) {
      var rNew = r + dx[i];
      var cNew = c + dy[i];
      if (rNew == rFinish && cNew == cFinish) {
        return [allSteps, path];
      }
      if (rNew >= 0 && rNew < gridDimension && cNew >= 0 && cNew < gridDimension
          && !visited[rNew][cNew] && !isBlocked[rNew][cNew]) {
            var pathNew = path.slice();
            pathNew.push([rNew, cNew]);
            q.push([[rNew, cNew], pathNew]);
            visited[rNew][cNew] = true;
      }
    }
  }
  return [allSteps, [rStart, cStart]];
}

drawGrid(gridDimension);

fillCell(xCellToPixel(startColumn), yCellToPixel(startRow), green);
fillCell(xCellToPixel(endColumn), yCellToPixel(endRow), red);

var index = 1;

function animateBFS() {
  if (index < movesArray.length) {
    var move = movesArray[index];
    fillCell(xCellToPixel(move[1]), yCellToPixel(move[0]), blue);
    index++;
  }
  if (index >= movesArray.length) {
    var indexIntoPath = index - movesArray.length;
    if (indexIntoPath < bestPath.length) {
      var move = bestPath[indexIntoPath];
      fillCell(xCellToPixel(move[1]), yCellToPixel(move[0]), green);
      index++;
    }
  }
  requestAnimationFrame(animateBFS);
}
