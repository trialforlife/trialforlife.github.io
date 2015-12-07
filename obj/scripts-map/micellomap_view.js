tMaps.MapView = function (mapControl, veiwportElement, mapElement, mapCanvas, mapGUI) {
  this.mapControl = mapControl;
  this.mapCanvas = mapCanvas;
  this.mapGUI = mapGUI;
  this.viewport = veiwportElement;
  this.mapElement = mapElement;
  this.mapXInViewport = 0;
  this.mapYInViewport = 0;
  this.scale = 0;
  this.zoomInt = 0;
  this.setQuantizedScale(1.5);
  this.m2c = [1, 0, 0, 1, 0, 0];
  this.c2m = [1, 0, 0, 1, 0, 0];
  this.baseM2C = [1, 0, 0, 1];
  this.baseC2M = [1, 0, 0, 1];
  this.baseOffM = [0, 0];
  this.baseOffC = [0, 0];
  this.northAtTop = false;
  this.customView = false;
  this.onViewChange = null;
  this.event = {};
  this.defaultX = 0;
  this.defaultY = 0;
  this.defaultW = 0;
  this.defaultH = 0;
  this.drawingSet = false
};
tMaps.MapView.prototype.translate = function (offsetX, offsetY) {
  var newViewportX = this.mapXInViewport + offsetX;
  var newViewportY = this.mapYInViewport + offsetY;
  if ((newViewportX + this.baseWidth * this.scale < this.viewport.offsetWidth / 2) || (newViewportX > this.viewport.offsetWidth / 2) || (newViewportY + this.baseHeight * this.scale < this.viewport.offsetHeight / 2) || (newViewportY > this.viewport.offsetHeight / 2)) {
    return
  }
  this.mapXInViewport = newViewportX;
  this.mapYInViewport = newViewportY;
  ;
  this.mapElement.style.left = this.mapXInViewport + "px";
  this.mapElement.style.top = this.mapYInViewport + "px";
  this.mapCanvas.onPan(-this.mapXInViewport, -this.mapYInViewport, -this.mapXInViewport + this.viewport.offsetWidth, -this.mapYInViewport + this.viewport.offsetHeight);
  if (this.onViewChange) {
    this.event.pan = 1;
    this.event.zoom = 0;
    this.onViewChange(this.event)
  }
};
tMaps.MapView.prototype.zoomIn = function (b, a) {
  this.setZoom(this.scale * 1.3, b, a)
};
tMaps.MapView.prototype.zoomOut = function (b, a) {
  this.setZoom(this.scale / 1.3, b, a)
};
tMaps.MapView.prototype.setZoom = function (b, j, h) {
  if ((b * this.baseWidth < this.viewport.offsetWidth) && (b * this.baseHeight < this.viewport.offsetHeight)) {
    var k = this.viewport.offsetWidth / this.baseWidth;
    var g = this.viewport.offsetHeight / this.baseHeight;
    b = (g < k) ? g : k
  }
  if (!j) {
    j = this.viewport.offsetWidth / 2 - this.mapXInViewport;
    h = this.viewport.offsetHeight / 2 - this.mapYInViewport
  }
  if (b <= 0) {
    b = 1
  }
  var f = this.scale;
  this.setQuantizedScale(b);
  this.setTransformScale();
  var a = Math.ceil(this.baseWidth * this.scale);
  var m = Math.ceil(this.baseHeight * this.scale);
  var d = j * this.scale / f;
  var c = h * this.scale / f;
  this.mapXInViewport += j - d;
  this.mapYInViewport += h - c;
  if (this.mapXInViewport + a < this.viewport.offsetWidth / 2) {
    this.mapXInViewport = this.viewport.offsetWidth / 2 - a
  } else {
    if (this.mapXInViewport > this.viewport.offsetWidth / 2) {
      this.mapXInViewport = this.viewport.offsetWidth / 2
    }
  }
  if (this.mapYInViewport + m < this.viewport.offsetHeight / 2) {
    this.mapYInViewport = this.viewport.offsetHeight / 2 - m
  } else {
    if (this.mapYInViewport > this.viewport.offsetHeight / 2) {
      this.mapYInViewport = this.viewport.offsetHeight / 2
    }
  }
  tMaps.MapGUI.setCssOrigin(this.mapElement, 0, 0);
  tMaps.MapGUI.setCssScale(this.mapElement, 1);
  this.mapElement.style.width = a + "px";
  this.mapElement.style.height = m + "px";
  this.mapElement.style.left = this.mapXInViewport + "px";
  this.mapElement.style.top = this.mapYInViewport + "px";
  this.mapCanvas.onZoom();
  if (this.mapGUI.MAP_SCALE_VIEW != "off") {
    this.mapGUI.onResize()
  }
  if (this.onViewChange) {
    this.event.pan = 0;
    this.event.zoom = 1;
    this.onViewChange(this.event)
  }
};
tMaps.MapView.prototype.getZoom = function () {
  return this.scale
};
tMaps.MapView.prototype.getZoomInt = function () {
  return this.zoomInt
};
tMaps.MapView.prototype.home = function () {
  this.resetView();
  this.mapCanvas.onZoom();
  if (this.onViewChange) {
    this.event.pan = 0;
    this.event.zoom = 1;
    this.onViewChange(this.event)
  }
};
tMaps.MapView.prototype.getViewportWidth = function () {
  return this.viewport.clientWidth;
};
tMaps.MapView.prototype.getViewportHeight = function () {
  return this.viewport.clientHeight
};
tMaps.MapView.prototype.canvasToMapX = function (mapCanvasX, mapCanvasY) {
  return this.c2m[0] * mapCanvasX + this.c2m[2] * mapCanvasY + this.c2m[4]
};
tMaps.MapView.prototype.canvasToMapY = function (mapCanvasX, mapCanvasY) {
  return this.c2m[1] * mapCanvasX + this.c2m[3] * mapCanvasY + this.c2m[5]
};
tMaps.MapView.prototype.mapToCanvasX = function (mapX, mapY) {
  return this.m2c[0] * mapX + this.m2c[2] * mapY + this.m2c[4]
};
tMaps.MapView.prototype.mapToCanvasY = function (mapX, mapY) {
  return this.m2c[1] * mapX + this.m2c[3] * mapY + this.m2c[5]
};
tMaps.MapView.prototype.viewportToMapX = function (viewportX, viewportY) {
  return this.canvasToMapX(viewportX - this.mapXInViewport, viewportY - this.mapYInViewport)
};
tMaps.MapView.prototype.viewportToMapY = function (viewportX, viewportY) {
  return this.canvasToMapY(viewportX - this.mapXInViewport, viewportY - this.mapYInViewport)
};
tMaps.MapView.prototype.mapToViewportX = function (mapCanvasX, mapCanvasY) {
  return this.mapToCanvasX(mapCanvasX, mapCanvasY) + this.mapXInViewport;
};
tMaps.MapView.prototype.mapToViewportY = function (mapCanvasX, mapCanvasY) {
  return this.mapToCanvasY(mapCanvasX, mapCanvasY) + this.mapYInViewport;
};
tMaps.MapView.prototype.getViewportX = function () {
  return -this.mapXInViewport
};
tMaps.MapView.prototype.getViewportY = function () {
  return -this.mapYInViewport
};
tMaps.MapView.prototype.getM2C = function () {
  return this.m2c
};
tMaps.MapView.prototype.getC2M = function () {
  return this.c2m
};
tMaps.MapView.prototype.updateDrawing = function (currentDrawing) {
  if ((currentDrawing) && (this.northAtTop) && (currentDrawing.ar)) {
    this.setBaseAngRad(-currentDrawing.ar)
  } else {
    if (!this.customView) {
      this.setBaseAngRad(0)
    }
  }
  var i;
  for (i = 0; i < 4; i++) {
    this.m2c[i] = this.baseM2C[i];
    this.c2m[i] = this.baseC2M[i]
  }
  this.m2c[4] = 0;
  this.m2c[5] = 0;
  this.c2m[4] = 0;
  this.c2m[5] = 0;
  if (!currentDrawing) {
    this.baseWidth = 0;
    this.baseHeight = 0;
    this.defaultMapX = 0;
    this.defaultMapY = 0;
    this.defaultW = 0;
    this.defaultH = 0;
    this.drawingSet = false
  } else {
    var b = [];
    b.push([this.mapToCanvasX(currentDrawing.w, 0), this.mapToCanvasY(currentDrawing.w, 0)]);
    b.push([this.mapToCanvasX(0, currentDrawing.h), this.mapToCanvasY(0, currentDrawing.h)]);
    b.push([this.mapToCanvasX(currentDrawing.w, currentDrawing.h), this.mapToCanvasY(currentDrawing.w, currentDrawing.h)]);
    var a = 0;
    var h = 0;
    var g = 0;
    var f = 0;
    for (i = 0; i < 3; i++) {
      if (a > b[i][0]) {
        a = b[i][0]
      }
      if (h > b[i][1]) {
        h = b[i][1]
      }
      if (g < b[i][0]) {
        g = b[i][0]
      }
      if (f < b[i][1]) {
        f = b[i][1]
      }
    }
    this.baseOffM[0] = -a;
    this.baseOffM[1] = -h;
    this.baseWidth = g - a;
    this.baseHeight = f - h;
    this.baseOffC[0] = -this.canvasToMapX(-a, -h);
    this.baseOffC[1] = -this.canvasToMapY(-a, -h);
    if (currentDrawing.v) {
      this.defaultMapX = currentDrawing.v.cx;
      this.defaultMapY = currentDrawing.v.cy;
      this.defaultW = currentDrawing.v.w;
      this.defaultH = currentDrawing.v.h
    } else {
      this.defaultMapX = currentDrawing.w / 2;
      this.defaultMapY = currentDrawing.h / 2;
      this.defaultW = this.baseWidth;
      this.defaultH = this.baseHeight
    }
    this.drawingSet = true
  }
  this.resetView()
};
tMaps.MapView.prototype.resetView = function () {
  if ((this.drawingSet) && (this.defaultW > 0) && (this.defaultH > 0)) {
    var widthProportion = this.getViewportWidth() / this.defaultW;
    var heightProportion = this.getViewportHeight() / this.defaultH;
    var scale = (widthProportion > heightProportion) ? heightProportion : widthProportion;
    this.setQuantizedScale(scale * 0.95);
  } else {
    this.setQuantizedScale(.7)
  }
  this.setTransformScale();
  var c = this.baseWidth * this.scale;
  var a = this.baseHeight * this.scale;
  this.mapXInViewport = this.viewport.offsetWidth / 2 - this.mapToCanvasX(this.defaultMapX, this.defaultMapY);
  this.mapYInViewport = this.viewport.offsetHeight / 2 - this.mapToCanvasY(this.defaultMapX, this.defaultMapY);
  this.mapElement.style.width = c + "px";
  this.mapElement.style.height = a + "px";
  this.mapElement.style.left = this.mapXInViewport + "px";
  this.mapElement.style.top = this.mapYInViewport + "px";
};
tMaps.MapView.prototype.setTransformScale = function () {
  var a;
  for (a = 0; a < 4; a++) {
    this.m2c[a] = this.baseM2C[a] * this.scale;
    this.c2m[a] = this.baseC2M[a] / this.scale
  }
  for (a = 0; a < 2; a++) {
    this.m2c[4 + a] = this.baseOffM[a] * this.scale;
    this.c2m[4 + a] = this.baseOffC[a]
  }
};
tMaps.MapView.SCALE_QUANT = 65536;
tMaps.MapView.prototype.setQuantizedScale = function (scale) {
  this.zoomInt = Math.floor(scale * tMaps.MapView.SCALE_QUANT);
  this.scale = this.zoomInt / tMaps.MapView.SCALE_QUANT
};
tMaps.MapView.prototype.setBaseAngRad = function (a) {
  while (a > Math.PI) {
    a -= 2 * Math.PI
  }
  while (a < -Math.PI) {
    a += 2 * Math.PI
  }
  var d = Math.cos(a);
  var b = Math.sin(a);
  this.baseM2C = [d, -b, b, d];
  this.baseC2M = [d, b, -b, d];
  this.mapCanvas.baseAngleRad = a
};
tMaps.MapView.prototype.setTopNorth = function (a) {
  this.northAtTop = a;
  this.customView = false
};
tMaps.MapView.prototype.setBaseTransform = function (b, c) {
  var a = Math.sqrt(b[0] * b[3] - b[1] * b[2]);
  this.baseM2C[0] = b[0] / a;
  this.baseM2C[1] = b[1] / a;
  this.baseM2C[2] = b[2] / a;
  this.baseM2C[3] = b[3] / a;
  this.baseC2M[0] = this.baseM2C[3];
  this.baseC2M[1] = -this.baseM2C[1];
  this.baseC2M[2] = -this.baseM2C[2];
  this.baseC2M[3] = this.baseM2C[0];
  this.customView = true;
  this.mapCanvas.baseAngleRad = c
};