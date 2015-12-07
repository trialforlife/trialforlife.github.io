tMaps.MapTile = function (b, c, a, d) {
  this.mapElement = b;
  this.canvas = document.createElement("canvas");
  this.canvas.style.position = "absolute";
  this.canvas.style.zIndex = d;
  this.canvas.style.visiblity = "hidden";
  this.canvas.mapTarget = true;
  this.mapElement.appendChild(this.canvas);
  this.width = c;
  this.height = a;
  this.canvas.width = c;
  this.canvas.height = a;
  this.invalid = true;
  this.connected = false;
  this.clearZoomCache(false)
};
tMaps.MapTile.prototype.init = function (a, b, d, c) {
  this.lid = b;
  this.zoomInt = a.getZoomInt();
  this.tileX = d;
  this.tileY = c;
  this.elementX = d * this.width;
  this.elementY = c * this.height;
  this.elementMaxX = this.elementX + this.width;
  this.elementMaxY = this.elementY + this.height;
  this.setMinMax(a);
  this.scale = a.getZoom();
  this.key = tMaps.MapTile.getKey(a, b, d, c);
  this.invalid = true;
  this.connected = false;
  this.zoomCache = false
};
tMaps.MapTile.prototype.setMinMax = function (a) {
  this.minX = a.canvasToMapX(this.elementX, this.elementY);
  this.minY = a.canvasToMapY(this.elementX, this.elementY);
  this.maxX = this.minX;
  this.maxY = this.minY;
  this.updateMinMax(a, this.elementMaxX, this.elementY);
  this.updateMinMax(a, this.elementX, this.elementMaxY);
  this.updateMinMax(a, this.elementMaxX, this.elementMaxY)
};
tMaps.MapTile.prototype.updateMinMax = function (d, a, f) {
  var c = d.canvasToMapX(a, f);
  if (c < this.minX) {
    this.minX = c
  }
  if (c > this.maxX) {
    this.maxX = c
  }
  var b = d.canvasToMapY(a, f);
  if (b < this.minY) {
    this.minY = b
  }
  if (b > this.maxY) {
    this.maxY = b
  }
};
tMaps.MapTile.getKey = function (a, b, d, c) {
  return b + "|" + a.getZoomInt() + "|" + d + "|" + c
};
tMaps.MapTile.prototype.disconnect = function () {
  this.canvas.style.visibility = "hidden";
  this.connected = false
};
tMaps.MapTile.prototype.connect = function () {
  this.canvas.style.left = this.elementX + "px";
  this.canvas.style.top = this.elementY + "px";
  this.canvas.style.visibility = "visible";
  this.connected = true
};
tMaps.MapTile.prototype.mapIntersects = function (a) {
  return ((this.minX < a[1][0]) && (this.minY < a[1][1]) && (this.maxX > a[0][0]) && (this.maxY > a[0][1]))
};
tMaps.MapTile.prototype.setZoomCache = function (b) {
  if (tMaps.MapGUI.setCssScale) {
    this.zoomCache = true;
    var a = b / this.scale;
    tMaps.MapGUI.setCssScale(this.canvas, a);
    this.canvas.style.left = (a * this.elementX + (a - 1) * this.width / 2) + "px";
    this.canvas.style.top = (a * this.elementY + (a - 1) * this.width / 2) + "px"
  }
};
tMaps.MapTile.prototype.clearZoomCache = function (a) {
  if (tMaps.MapGUI.setCssScale) {
    this.zoomCache = false;
    tMaps.MapGUI.setCssScale(this.canvas, 1);
    if (a) {
      this.disconnect()
    }
  }
};

