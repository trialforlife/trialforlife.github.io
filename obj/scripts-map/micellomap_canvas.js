tMaps.MapCanvas = function (mapControl, mapElement) {
  this.mapControl = mapControl;
  this.view = null;
  this.data = null;
  this.mapElement = mapElement;
  this.tileMap = {};
  this.mapTheme = null;
  this.themeDrawing = null;
  this.themeList = [];
  this.themeFamily = "Texture";
  this.popups = [];
  this.onMapClick = null;
  this.MAP_FONT = "HelveticaNeue-Light";
  this.MAP_FONT_FALLBACK = "helvetica";
  this.MAP_FONT_MIN = 10;
  this.MAP_FONT_MAX = 20;
  this.MIN_TEXT_SCALE = null;
  this.MAX_TEXT_SCALE = null;
  this.LABEL_BG_COLOR = "#ffffff";
  this.LABEL_BG_PADDING = 3;
  this.LABEL_BG_MARGIN = 3;
  this.LABEL_BG_RADIUS = 3;
  this.LABEL_BG_STROKE_COLOR = "#666666";
  this.LABEL_BG_SHADOW_COLOR = "#666666";
  this.LABEL_BG_SHADOW_BLUR = 3;
  this.LABEL_BG_SHADOW_XOFF = 1;
  this.LABEL_BG_SHADOW_YOFF = 1;
  this.TILE_SIZE = 400;
  this.DRAW_WAIT = 25;
  this.TILE_FACTOR = 2;
  this.IMAGE_DRAW_WAIT = 500;
  this.SHADOW_COLOR = "#333333";
  this.SHADOW_X = 2;
  this.SHADOW_Y = 2;
  this.SHADOW_BLUR = 3;
  this.minMapX = 0;
  this.minMapY = 0;
  this.maxMapX = 0;
  this.maxMapY = 0;
  this.baseAngleRad = 0
};
tMaps.MapCanvas.DEFAULT_MARKER_ZI = 1;
tMaps.MapCanvas.prototype.createPopup = function () {
  var a = new tMaps.MapPopup(this, this.mapElement, this.view);
  this.popups.push(a);
  return a
};
tMaps.MapCanvas.prototype.removePopup = function (a) {
  a.setActive(false);
  var c;
  var b = this.popups.length;
  for (c = 0; c < b; c++) {
    if (this.popups[c] == a) {
      this.popups.splice(c, 1)
    }
  }
};
//  tMaps.MapCanvas.prototype.addTheme = function (a){
//    this.themeList.push(a)
//  };
//  tMaps.MapCanvas.prototype.clearThemes = function (){
//    this.themeList = []
//  };
//  tMaps.MapCanvas.prototype.getThemes = function (){
//    return this.themeList
//  };
//  tMaps.MapCanvas.prototype.setThemeFamily = function (a){
//    this.themeFamily = a
//  };
//  tMaps.MapCanvas.prototype.getThemeFamily = function (){
//    return this.themeFamily
//  };
tMaps.MapCanvas.prototype.drawMap = function () {
  tMaps.asynchDraw.waitDraw(this, this.DRAW_WAIT, this.mapControl.mapName)
};
tMaps.MapCanvas.prototype.addMarker = function (a) {
  if (!a.mr) {
    return
  }
  var d;
  if (a.mt == tMaps.markertype.NAMED) {
    if ((this.mapTheme) && (this.mapTheme.loaded)) {
      d = this.mapTheme.getMarker(a.mr)
    }
  } else {
    if (a.mt == tMaps.markertype.IMAGE) {
      d = a.mr
    }
  }
  if (d) {
    var b = document.createElement("img");
    b.src = d.src;
    b.mapTarget = true;
    b.mapObject = a;
    b.onmousedown = function (f) {
      if (f.preventDefault) {
        f.preventDefault()
      }
    };
    a.cx = 0;
    a.cy = 0;
    if (d.ox != null) {
      a.ox = d.ox
    } else {
      a.ox = 0
    }
    if (d.oy != null) {
      a.oy = d.oy
    } else {
      a.oy = 0
    }
    if (a.zi == null) {
      a.zi = tMaps.MapCanvas.DEFAULT_MARKER_ZI
    }
    a.element = b;
    b.style.position = "absolute";
    b.style.zIndex = a.zi;
    b.style.top = "0px";
    b.style.left = "0px";
    a.visible = true;
    var c = this.data.getCurrentLevel();
    this.updateMarker(a, c);
    this.mapElement.appendChild(b)
  }
};
tMaps.MapCanvas.prototype.updateMarker = function (c, d) {
  if ((!d) || (d.id != c.lid)) {
    if (c.visible) {
      c.visible = false;
      c.element.style.visibility = "hidden"
    }
  } else {
    if (!c.visible) {
      c.visible = true;
      c.element.style.visibility = "visible"
    }
    var b = this.view.mapToCanvasX(c.mx, c.my);
    var a = this.view.mapToCanvasY(c.mx, c.my);
    if ((b != c.cx) || (a != c.cy)) {
      c.element.style.left = String(b - c.ox) + "px";
      c.element.style.top = String(a - c.oy) + "px";
      c.cx = b;
      c.cy = a
    }
  }
};
tMaps.MapCanvas.prototype.removeMarker = function (a) {
  this.mapElement.removeChild(a.element);
  delete a.element;
};
tMaps.MapCanvas.prototype.getMarkerCenterX = function (a) {
  if ((!a.ox) || (!a.element)) {
    return Number.NaN
  }
  return a.mx - a.ox + a.element.offsetWidth / 2
};
tMaps.MapCanvas.prototype.getMarkerCenterY = function (a) {
  if ((!a.oy) || (!a.element)) {
    return Number.NaN
  }
  return a.my - a.oy + a.element.offsetHeight / 2
};
tMaps.MapCanvas.prototype.updateDomOverlays = function (d, c) {
  var b;
  var f;
  var a = this.popups.length;
  for (b = 0; b < a; b++) {
    this.popups[b].update()
  }
  if (d) {
    f = d.m;
    if (f) {
      a = f.length;
      for (b = 0; b < a; b++) {
        this.updateMarker(f[b], d)
      }
    }
  }
  if (c) {
    f = c.m;
    if (f) {
      a = f.length;
      for (b = 0; b < a; b++) {
        this.updateMarker(f[b], d)
      }
    }
  }
};
tMaps.MapCanvas.prototype.invalidateGeom = function (route, d, g) {
  if (!route.mm) {
    this.loadGeomMinMax(route)
  }
  var c;
  var f = false;
  for (var a in this.tileMap) {
    c = this.tileMap[a];
    if ((c.lid == d) && (!c.invalid) && (c.mapIntersects(route.mm))) {
      c.invalid = true;
      if (c.connected) {
        f = true
      }
    }
  }
  if (f) {
    this.drawMap()
  }
};
tMaps.MapCanvas.prototype.updatelevel = function (b, a) {
  this.updateDomOverlays(b, a);
  if (b) {
    this.drawMap()
  } else {
    this.clearCanvas()
  }
};
tMaps.MapCanvas.prototype.onPan = function (b, a, d, c) {
  if ((b < this.minPixX) || (a < this.minPixY) || (d > this.maxPixX) || (c > this.maxPixY)) {
    this.drawMap()
  }
};
tMaps.MapCanvas.prototype.onZoom = function () {
  this.prepareZoomCache();
  this.updateDomOverlays(this.data.getCurrentLevel(), null);
  this.drawMap()
};
tMaps.MapCanvas.prototype.prepareZoomCache = function () {
  if (tMaps.MapGUI.setCssScale) {
    this.zoomCached = true;
    var b = this.view.getZoom();
    for (var a in this.tileMap) {
      c = this.tileMap[a];
      if (c.connected) {
        c.setZoomCache(b)
      }
    }
  } else {
    var c;
    for (var a in this.tileMap) {
      c = this.tileMap[a];
      if (c.connected) {
        c.disconnect()
      }
    }
  }
};
tMaps.MapCanvas.prototype.clearZoomCache = function () {
  if (tMaps.MapGUI.setCssScale) {
    this.zoomCached = false;
    for (var a in this.tileMap) {
      tile = this.tileMap[a];
      if (tile.zoomCache) {
        tile.clearZoomCache(true)
      }
    }
  }
};
tMaps.MapCanvas.prototype.drawMapExe = function () {
  var q = false;
  var b = this.data.getCurrentLevel();
  if (!b) {
    return
  }
  var G = this.data.getCurrentDrawing();
  if (this.themeDrawing != G) {
    this.loadTheme(G);
    return
  }
  var n = this.mapElement.offsetWidth;
  var f = this.mapElement.offsetHeight;
  var t = this.view.getViewportWidth();
  var g = this.view.getViewportHeight();
  var E = this.view.getViewportX();
  if (E < 0) {
    E = 0
  }
  var D = this.view.getViewportY();
  if (D < 0) {
    D = 0
  }
  var d = E + t;
  if (d > n) {
    d = n
  }
  var c = D + g;
  if (c > f) {
    c = f
  }
  var C = Math.floor(E / this.TILE_SIZE);
  var A = Math.floor(D / this.TILE_SIZE);
  var B = Math.floor(d / this.TILE_SIZE);
  var z = Math.floor(c / this.TILE_SIZE);
  this.minPixX = C * this.TILE_SIZE;
  this.minPixY = A * this.TILE_SIZE;
  this.maxPixX = (B + 1) * this.TILE_SIZE;
  this.maxPixY = (z + 1) * this.TILE_SIZE;
  var j = (B - C + 1) * (z - A + 1) * this.TILE_FACTOR;
  var H;
  var F;
  var k = new Date().getTime();
  var h = null;
  var r;
  var p;
  var v = null;
  for (var o = C; o <= B; o++) {
    for (var m = A; m <= z; m++) {
      H = tMaps.MapTile.getKey(this.view, b.id, o, m);
      F = this.tileMap[H];
      if (F) {
        F.timeStamp = k;
        if (F.zoomCache) {
          F.clearZoomCache(false)
        }
        if (F.invalid) {
          if (!h) {
            h = F
          }
        } else {
          if (!F.connected) {
            F.connect()
          }
        }
      } else {
        r = o;
        p = m;
        v = H
      }
    }
  }
  if ((this.zoomCached) && (!h) && (!v)) {
    this.clearZoomCache()
  }
  var a;
  var w = null;
  var s = 0;
  for (var u in this.tileMap) {
    s++;
    F = this.tileMap[u];
    if ((F.timeStamp < k) && (!F.zoomCache)) {
      if (F.connected) {
        F.disconnect()
      }
      if ((!w) || (F.timeStamp < a)) {
        a = F.timeStamp;
        w = F
      }
    }
  }
  if (h) {
    this.drawTile(h);
    q = true
  } else {
    if (v != null) {
      if ((!w) || (s < j)) {
        w = new tMaps.MapTile(this.mapElement, this.TILE_SIZE, this.TILE_SIZE, 0)
      } else {
        delete this.tileMap[w.key]
      }
      w.init(this.view, b.id, r, p);
      this.tileMap[w.key] = w;
      this.drawTile(w);
      q = true
    }
  }
  if (q) {
    this.drawMap()
  }
};
tMaps.MapCanvas.prototype.clearCanvas = function () {
  for (var a in this.tileMap) {
    tile = this.tileMap[a];
    if (tile.connected) {
      tile.disconnect()
    }
  }
};
tMaps.MapCanvas.prototype.drawTile = function (g) {
  var h = this.data.getCurrentLevel();
  if ((!h) || (h.id != g.lid)) {
    return
  }
  if (this.view.getZoomInt() != g.zoomInt) {
    return
  }
  g.canvas.width = g.canvas.width;
  var b = g.canvas.getContext("2d");
  if (this.MIN_TEXT_SCALE != null) {
    this.MAP_FONT_MIN = this.MIN_TEXT_SCALE * 10
  }
  if (this.MAX_TEXT_SCALE != null) {
    this.MAP_FONT_MAX = this.MAX_TEXT_SCALE * 10
  }
  this.MAP_FONT_MIN = parseInt(this.MAP_FONT_MIN);
  this.MAP_FONT_MAX = parseInt(this.MAP_FONT_MAX);
  b.font = this.MAP_FONT_MAX + "px " + this.MAP_FONT + ", " + this.MAP_FONT_FALLBACK;
  b.lineJoin = "round";
  b.lineCap = "round";
  if (b) {
    var d = this.view.getM2C();
    var a = this.view.getC2M();
    b.translate(-g.elementX, -g.elementY);
    b.transform(d[0], d[1], d[2], d[3], d[4], d[5]);
    var c;
    var f = h.gList;
    for (f.start();
         ((c = f.currentList()) != null); f.next()) {
      this.render(b, c, g)
    }
    b.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
    b.translate(g.elementX, g.elementY)
  }
  g.invalid = false;
  if (!g.connected) {
    g.connect()
  }
};
tMaps.MapCanvas.prototype.render = function (CanvasContext, objects, mapTile) {
  if ((!this.mapTheme) || (!this.mapTheme.loaded)) {
    return;
  }
  var objectsLength = objects.length;
  var mapTileScale = mapTile.scale;
  
  for (var i = 0; i < objectsLength; i++) {
    var object = objects[i];
    if ((object.mm) && (!mapTile.mapIntersects(object.mm))) {
      continue;
    }
    if (object.st == 2) {
      object.style = undefined;
      if (object.os && object.t != "Selected") {
        object.style = object.os;
      }
      if (!object.style && object.t) {
        object.style = this.mapTheme.getStyle(object.t);
      }
      if (object.style == undefined) {
        object.style = this.mapTheme.getStyle("Unit");
      }
      if (object.style == undefined) {
        continue;
      }

      this.renderPath(CanvasContext, object, mapTileScale, mapTile);
    }
  }
  for (var i = 0; i < objectsLength; i++) {
    var object = objects[i];
    if ((object.mm) && (!mapTile.mapIntersects(object.mm))) {
      continue;
    } else {
      this.renderLabel(object, CanvasContext, mapTileScale);
    }

  }
};
tMaps.MapCanvas.prototype.drawLabelBackground = function (n, k, f, d, c, b) {
  n.fillStyle = (b.label.m) ? b.label.m : this.LABEL_BG_COLOR;
  var a = (b.label.radius != undefined) ? parseInt(b.label.radius) : this.LABEL_BG_RADIUS;
  k = k - (d * 2);
  f = f - (d * 2);
  var j = -(k / 2) - (c / 2);
  var g = -(f / 2) - (c / 2);
  n.beginPath();
  n.moveTo(j + a, g);
  n.lineTo(j + (k + c) - a, g);
  n.quadraticCurveTo(j + (k + c), g, j + (k + c), g + a);
  n.lineTo(j + (k + c), g + (f + c) - a);
  n.quadraticCurveTo(j + (k + c), g + (f + c), j + (k + c) - a, g + (f + c));
  n.lineTo(j + a, g + (f + c));
  n.quadraticCurveTo(j, g + (f + c), j, g + (f + c) - a);
  n.lineTo(j, g + a);
  n.quadraticCurveTo(j, g, j + a, g);
  n.closePath();
  if (b.label.shadow) {
    if (b.label.shadow == true) {
      n.shadowColor = this.LABEL_BG_SHADOW_COLOR;
      n.shadowBlur = this.LABEL_BG_SHADOW_BLUR;
      n.shadowOffsetX = this.LABEL_BG_SHADOW_XOFF;
      n.shadowOffsetY = this.LABEL_BG_SHADOW_YOFF
    } else {
      if (b.label.shadow == false) {
        n.shadowColor = "rgba(0,0,0,0.0)"
      } else {
        n.shadowColor = b.label.shadow[0];
        n.shadowBlur = b.label.shadow[1];
        n.shadowOffsetX = b.label.shadow[2];
        n.shadowOffsetY = b.label.shadow[3]
      }
    }
  } else {
    n.shadowColor = "rgba(0,0,0,0.0)"
  }
  n.fill();
  n.shadowColor = "rgba(0,0,0,0.0)";
  if (b.label.o) {
    n.strokeStyle = b.label.o;
    n.stroke()
  }
};
tMaps.MapCanvas.prototype.renderPath = function (CanvasContext, object, mapTileScale, mapTile) {
  var objectStyle = object.style;
  var k = object.gt;
  if (k == undefined) {
    k = 2
  }
  var r = object.gw;
  var t = object.shp;
  var n;
  CanvasContext.beginPath();
  var b = t.length;
  for (var d = 0; d < b; d++) {
    n = t[d];
    switch (n[0]) {
      case 0:
        CanvasContext.moveTo(n[1], n[2]);
        break;
      case 1:
        CanvasContext.lineTo(n[1], n[2]);
        break;
      case 2:
        CanvasContext.quadraticCurveTo(n[1], n[2], n[3], n[4]);
        break;
      case 3:
        CanvasContext.bezierCurveTo(n[1], n[2], n[3], n[4], n[5], n[6]);
        break;
      case 4:
        CanvasContext.closePath();
        break
    }
  }
  if (k == 2) {
    if (objectStyle.shadow != undefined && objectStyle.shadow != false) {
      var q = objectStyle.shadow;
      if (q === true) {
        CanvasContext.shadowColor = this.SHADOW_COLOR;
        CanvasContext.shadowBlur = this.SHADOW_BLUR * (mapTileScale * 1.5);
        CanvasContext.shadowOffsetX = this.SHADOW_X * (mapTileScale + 1);
        CanvasContext.shadowOffsetY = this.SHADOW_Y * (mapTileScale + 1)
      } else {
        CanvasContext.shadowColor = q[0];
        CanvasContext.shadowBlur = q[1] * (mapTileScale * 2);
        CanvasContext.shadowOffsetX = q[2] * (mapTileScale + 1);
        CanvasContext.shadowOffsetY = q[3] * (mapTileScale + 1)
      }
    }
    if (objectStyle.m != undefined) {
      CanvasContext.fillStyle = objectStyle.m;
      CanvasContext.fill()
    }
    CanvasContext.shadowColor = "rgba(0,0,0,0)";
    if (objectStyle.img != undefined && objectStyle.img != false) {
      if (!objectStyle.pattern && !objectStyle.error) {
        var o = {};
        o.pending = [mapTile];
        o.img = new Image();
        var m = this;
        o.img.onload = function () {
          m.updateImages(o)
        };
        if (objectStyle.img == true) {
          o.img.src = tMaps.settings.SCRIPT_URL + "/patterns/" + object.t + ".png"
        } else {
          o.img.src = objectStyle.img
        }
        objectStyle.error = false;
        o.img.onerror = function (s) {
          objectStyle.error = true
        };
        try {
          var h = CanvasContext.createPattern(o.img, "repeat")
        } catch (g) {
        }
        objectStyle.pattern = h
      }
      if (objectStyle.pattern) {
        CanvasContext.fillStyle = objectStyle.pattern;
        CanvasContext.fill()
      }
    }
    if ((objectStyle.o != undefined) && (objectStyle.w)) {
      CanvasContext.strokeStyle = objectStyle.o;
      CanvasContext.lineWidth = objectStyle.w / mapTileScale;
      CanvasContext.stroke()
    }
  } else {
    if (k == 3) {
      if (objectStyle.m != undefined) {
        CanvasContext.strokeStyle = objectStyle.m;
        CanvasContext.lineWidth = r;
        CanvasContext.stroke()
      }
    } else {
      if (k == 1) {
        if ((objectStyle.m != undefined) && (objectStyle.w)) {
          CanvasContext.strokeStyle = objectStyle.m;
          CanvasContext.lineWidth = objectStyle.w / mapTileScale;
          CanvasContext.stroke()
        }
      } else {
        alert("other geom type: " + k)
      }
    }
  }
};
tMaps.MapCanvas.prototype.renderLabel = function(object, CanvasContext, mapTileScale){
  if (object.style) {
    objectStyle = object.style;
  } else {
    return;
  }

  var objectLayerType = object.lt = object.lt ? object.lt : 1;
  var objectLabelColor = !objectStyle.t ? false : objectStyle.t;
  var mapFontMax = this.MAP_FONT_MAX;
  var title = object.lr;

  var objectLabelCoords = this.getLabelCoords(object);

  if (objectLabelCoords !== false && title != undefined) {
    var objectLabelWidth;
    //var N = null;
    //var P = null;
    var n = 0;
    var k = 0;

    if (objectLayerType === 1) {
      if (!objectLabelColor) {
        return;
      }

      var objectLabelContainer = object.tc;
      if ((!objectLabelContainer) || (objectLabelContainer.lr != title)) {
        if (this.MAP_FONT_CAPS) {
          title = title.toUpperCase()
        }
        var C = CanvasContext.measureText(title);
        objectLabelWidth = C.width;
        if (objectStyle.label) {
          var objectLabelMargin = (objectStyle.label.margin != undefined) ? parseInt(objectStyle.label.margin) : this.LABEL_BG_MARGIN;
          var objectLabelPaddig = (objectStyle.label.padding != undefined) ? parseInt(objectStyle.label.padding) : this.LABEL_BG_PADDING;
          objectLabelWidth = objectLabelWidth + (objectLabelMargin * 2) + (objectLabelPaddig * 2)
        }
        objectLabelContainer = {
          lr: title,
          w: objectLabelWidth,
          margin: objectLabelMargin,
          padding: objectLabelPaddig
        };
        object.tc = objectLabelContainer
      } else {
        objectLabelWidth = objectLabelContainer.w;
        objectLabelMargin = objectLabelContainer.margin;
        objectLabelPaddig = objectLabelContainer.padding
      }

      var labelScale = (function(){
        var labelWidthRatio = objectLabelCoords[2] / objectLabelWidth;
        var labelHeightRatio = objectLabelCoords[3] / this.MAP_FONT_MAX;
        return labelWidthRatio > labelHeightRatio ? labelHeightRatio : labelWidthRatio;
      })();

      var labelFontSize = ((labelScale * mapTileScale) * this.MAP_FONT_MAX);
      if (labelFontSize < this.MAP_FONT_MIN) {
        return;
      }
      if (labelFontSize > this.MAP_FONT_MAX) {
        var fontRatio = this.MAP_FONT_MAX / labelFontSize;
        labelScale = labelScale * fontRatio;
      }

      var rotationAngle = this.baseAngleRad ? this.getRotationAngle(rotationAngle, objectLayerType, labelWidthRatio / labelHeightRatio) : objectLabelCoords[4];

    } else {
      /*
       if ((objectLayerType == 2) || (objectLayerType == 4)) {
       if (objectLayerType == 2) {
       N = this.mapTheme.getIcon(title)
       } else {
       N = title
       }
       if (!N) {
       continue
       }
       objectLabelWidth = N.w;
       mapFontMax = N.h;
       n = -objectLabelWidth / 2;
       k = -mapFontMax / 2
       } else {
       if (objectLayerType == 3) {
       if ((!object.imgInfo) || (object.imgInfo.labRef != title)) {
       var G = {};
       G.pending = [mapTileScale];
       G.img = new Image();
       G.labRef = title;
       object.imgInfo = G;
       var f = this;
       G.img.onload = function () {
       f.updateImages(G)
       };
       G.img.src = title;
       P = null
       } else {
       if (object.imgInfo.pending) {
       if (!this.arrayContains(object.imgInfo.pending, mapTileScale)) {
       object.imgInfo.pending.push(mapTileScale)
       }
       P = null
       } else {
       P = object.imgInfo.img;
       objectLabelWidth = P.width;
       mapFontMax = P.height;
       n = -objectLabelWidth / 2;
       k = -mapFontMax / 2
       }
       }
       }
       }
       */
    }

    CanvasContext.translate(objectLabelCoords[0], objectLabelCoords[1]);
    CanvasContext.rotate(rotationAngle);
    CanvasContext.scale(labelScale, labelScale);
    CanvasContext.translate(n, k);
    if (objectLabelColor) {
      if (objectStyle.label) {
        this.drawLabelBackground(CanvasContext, objectLabelWidth, mapFontMax, objectLabelMargin, objectLabelPaddig, objectStyle)
      }
      CanvasContext.fillStyle = objectLabelColor;
      CanvasContext.textAlign = "center";
      CanvasContext.textBaseline = "middle";
      CanvasContext.fillText(title, 0, 0)
    } else {
      /*
       if (N) {
       var s;
       var B = N.g.length;
       for (s = 0; s < B; s++) {
       var u = N.g[s];
       objectStyle = this.mapTheme.getStyle(u.t);
       this.renderPath(CanvasContext, u, objectStyle, mapTileScale)
       }
       } else {
       if (P) {
       CanvasContext.drawImage(P, 0, 0)
       }
       }
       */
    }
    CanvasContext.translate(-n, -k);
    CanvasContext.scale(1 / labelScale, 1 / labelScale);
    CanvasContext.rotate(-rotationAngle);
    CanvasContext.translate(-objectLabelCoords[0], -objectLabelCoords[1])
  }
};
tMaps.MapCanvas.prototype.clickMouse = function (posX, posY, obj) {
  var h = this.view.canvasToMapX(posX, posY);
  var g = this.view.canvasToMapY(posX, posY);
  var b = this.data.getCurrentLevel();
  if (!obj) {
    var j;
    var c;
    var k = b.gList;
    for (k.start();
         ((c = k.currentList()) != null); k.next()) {
      j = this.hitCheck(c, h, g);
      if (j) {
        obj = j
      }
    }
  }
  if (this.onMapClick) {
    this.onMapClick(h, g, obj)
  }
};
tMaps.MapCanvas.prototype.hitCheck = function (c, k, h) {
  var f = null;
  var d;
  var b = c.length;
  for (d = 0; d < b; d++) {
    var g = c[d];
    var j = g.gt;
    if ((j != 2) && (j != 0)) {
      continue
    }
    if ((g.shp) || ((g.l) && ((!g.shp) || (g.el)))) {
      if (!g.mm) {
        this.loadGeomMinMax(g)
      }
      if ((k > g.mm[0][0]) && (h > g.mm[0][1]) && (k < g.mm[1][0]) && (h < g.mm[1][1])) {
        var a = false;
        if (g.shp) {
          if (tMaps.geom.pathHit(g.shp, k, h)) {
            a = true
          }
        }
        if ((g.l) && ((!g.shp) || (g.el))) {
          if (tMaps.geom.rotRectHit(g.l, k, h)) {
            a = true
          }
        }
        if (a) {
          f = g
        }
      }
    }
  }
  return f
};
tMaps.MapCanvas.prototype.updateImages = function (d) {
  var c = d.pending;
  if (!c) {
    return
  }
  delete d.pending;
  var a;
  var b;
  for (a = 0; a < c.length; a++) {
    b = c[a];
    b.invalid = true
  }
  tMaps.asynchDraw.waitDraw(this, this.IMAGE_DRAW_WAIT, this.mapControl.mapName)
};
tMaps.MapCanvas.prototype.check = function (c, a) {
  var b;
  for (b = 0; b < c.length; b++) {
    if (c[b] == a) {
      return
    }
  }
  c.push(a)
};
tMaps.MapCanvas.prototype.loadTheme = function (data) {
  if (data) {
    if (!data.mts) {
      alert("Map format error");
      return;
    }
    this.mapTheme = new tMaps.MapTheme([data.mts]);
    this.themeDrawing = data;
  } else {
    return
  }

  this.onThemeLoaded(tMaps.mapThemeData);
  if (this.mapTheme.loaded) {
    this.mapThemeLoaded();
  }
};
tMaps.MapCanvas.prototype.onThemeLoaded = function (a) {
  this.themeList.push(a);
  if (this.mapTheme) {
    this.mapTheme.placeTheme(a);
    if (this.mapTheme.loaded) {
      this.mapThemeLoaded()
    }
  }
};
tMaps.MapCanvas.prototype.mapThemeLoaded = function () {
  if (this.mapTheme) {
    var m = this.data.getCommunity();
    if (!m) {
      return
    }
    var c;
    var b;
    var j;
    var k;
    var a;
    var h;
    for (c = 0; c < m.d.length; c++) {
      j = m.d[c];
      if (!j.l) {
        continue
      }
      for (b = 0; b < j.l.length; b++) {
        l = j.l[k];
        for (k = 0; k < j.l.length; k++) {
          a = j.l[k];
          var g = a.m;
          if (g) {
            var f = g.length;
            for (h = 0; h < f; h++) {
              if (!g[h].element) {
                this.addMarker(g[h])
              }
            }
          }
        }
      }
    }
    this.drawMap()
  }
};
tMaps.MapCanvas.prototype.loadGeomMinMax = function (route) {
  var mm = tMaps.geom.getInvalidMinMax();
  if (route.shp) {
    tMaps.geom.loadPathMinMax(route.shp, mm)
  }
  if ((route.l) && ((!route.shp) || (route.el))) {
    tMaps.geom.loadRotRectMinMax(route.l, mm)
  }
  route.mm = mm
};
tMaps.MapCanvas.prototype.arrayContains = function (b, d) {
  var c;
  for (c = 0; c < b.length; c++) {
    if (b[c] == d) {
      return true
    }
  }
  return false
};
tMaps.MapCanvas.prototype.getRotationAngle = function(rotationAngle, objectLayerType, labelRatio){
  var d = rotationAngle - this.baseAngleRad;
  var pi = Math.PI;
  if ((labelRatio < 1.1) && (labelRatio > 0.9)) {
    if ((objectLayerType == 2) || (objectLayerType == 4)) {
      while (d > pi / 4) {
        d -= pi / 2;
        rotationAngle -= pi / 2
      }
      while (d < -pi / 4) {
        d += pi / 2;
        rotationAngle += pi / 2
      }
    } else {
      while (d > pi / 2) {
        d -= pi;
        rotationAngle -= pi
      }
      while (d < -pi / 2) {
        d += pi;
        rotationAngle += pi
      }
    }
  } else {
    while (d > pi / 2) {
      d -= pi;
      rotationAngle -= pi
    }
    while (d < -pi / 2) {
      d += pi;
      rotationAngle += pi
    }
  }
  return rotationAngle;
};
tMaps.MapCanvas.prototype.getLabelCoords = function(object){
  if((object.lt && object.lt !== 1) || object.show_title === false){
    return false;
  }

  if(typeof object.l === "object" ){
    return JSON.stringify(object.l) === "[0,0,0,0,0]" ? false : object.l;
  }

  if(object.show_title === true){
    // find left point
    var posXmin = posXmax = object.shp[0][1];
    var posYmin = posYmax = object.shp[0][2];
    for(var i = 0; i < object.shp.length-1; i++){
      posXmin = posXmin < object.shp[i][1] ? posXmin : object.shp[i][1];
      posXmax = posXmax > object.shp[i][1] ? posXmax : object.shp[i][1];
      posYmin = posYmin < object.shp[i][2] ? posYmin : object.shp[i][2];
      posYmax = posYmax > object.shp[i][2] ? posYmax : object.shp[i][2];
    }
    var titleWidth = (posXmax - posXmin)*.8;
    var titleHeight = (posYmax - posYmin)*.2;
    var posX = (posXmax + posXmin)/2;
    var posY = (posYmax + posYmin)/2;

    object.l = [posX.toFixed(2), posY.toFixed(2), titleWidth.toFixed(2), titleHeight.toFixed(2), 0];
    return object.l;
  }

  return false;
};


tMaps.asynchDraw = {
  maps: {},
  waitDraw: function (c, a, b) {
    var d = this.maps[b];
    if (!d) {
      d = {};
      this.maps[b] = d
    }
    if (!d.active) {
      d.active = true;
      d.mapCanvas = c;
      setTimeout("tMaps.asynchDraw.drawMap('" + b + "')", a)
    }
  },
  drawMap: function (a) {
    var b = this.maps[a];
    if (!b) {
      return
    }
    b.active = false;
    b.mapCanvas.drawMapExe()
  }
};