tMaps.MapGUI = function (f) {
  this.mapControl = f;
  this.outsideContainer = document.getElementById(tMaps.mapName);
  if (!this.outsideContainer) {
    alert("Map container not found");
    return
  }
  this.viewportElement = document.createElement("div");
  this.viewportElement.setAttribute("id", "micello-map");
  this.viewportElement.mapTarget = true;

  this.outsideContainer.innerHTML = "";
  this.outsideContainer.appendChild(this.viewportElement);

  this.mapElement = document.createElement("div");
  this.mapElement.setAttribute("class", "map-panel");
  this.mapElement.mapTarget = true;

  tMaps.MapGUI.detectTransformName(this.mapElement);

  this.viewportElement.appendChild(this.mapElement);

  var mapGUI = this;
  // g = mouseEvent
  this.viewportElement.onmousedown = function (g) {
    mapGUI.onMouseDown(g)
  };
  this.viewportElement.onmouseup = function (g) {
    mapGUI.onMouseUp(g)
  };
  this.viewportElement.onmousemove = function (g) {
    mapGUI.onMouseMove(g)
  };
  this.viewportElement.ontouchstart = function (g) {
    mapGUI.onTouchStart(g)
  };
  this.viewportElement.ontouchmove = function (g) {
    mapGUI.onTouchMove(g)
  };
  this.viewportElement.ontouchend = function (g) {
    mapGUI.onTouchEnd(g)
  };
  this.viewportElement.ongesturestart = function (g) {
    mapGUI.onGestureStart(g)
  };
  this.viewportElement.ongesturechange = function (g) {
    mapGUI.onGestureChange(g)
  };
  this.viewportElement.ongestureend = function (g) {
    mapGUI.onGestureEnd(g)
  };
  this.viewportElement.addEventListener("DOMMouseScroll", function (g) {
    mapGUI.onMouseWheel(g)
  }, false);
  this.viewportElement.addEventListener("mousewheel", function (g) {
    mapGUI.onMouseWheel(g)
  }, false);
  this.mapElement.transitionCallNumber = 0;
  this.mapElement.transitionOn = function (duration) {
    this.transitionCallNumber++;
    this.style.WebkitTransition = "top " + duration + "s ease-out, left " + duration + "s ease-out";
    this.style.setProperty("-webkit-transition", "top " + duration + "s ease-out, left " + duration + "s ease-out");
    this.style.setProperty("-moz-transition", "top " + duration + "s ease-out, left " + duration + "s ease-out");
    this.style.setProperty("-o-transition", "top " + duration + "s ease-out, left " + duration + "s ease-out");
  }
  this.mapElement.transitionOff = function () {
    this.transitionCallNumber--;

    if (this.transitionCallNumber) {
      return;
    }

    this.style.WebkitTransition = "";
    this.style.setProperty("-webkit-transition", "");
    this.style.setProperty("-moz-transition", "");
    this.style.setProperty("-o-transition", "");
  }
  document.onkeydown = function (g) {
    mapGUI.onKeyDown(g)
  };
  document.onkeyup = function (g) {
    mapGUI.onKeyUp(g)
  };
  window.onresize = function () {
    mapGUI.onResize()
  };

  this.UI_FONT = "HelveticaNeue-Light";
  this.UI_FONT_FALLBACK = "helvetica";
  this.ui = document.createElement("div");
  this.ui.setAttribute("id", "ui-all");
  this.ui.style.fontFamily = this.UI_FONT;
  this.ui.onmousemove = function (g) {
    mapGUI.conditionalUI()
  };
  this.ui.addEventListener("DOMMouseScroll", function (g) {
    mapGUI.onMouseWheel(g)
  }, false);
  this.ui.addEventListener("mousewheel", function (g) {
    mapGUI.onMouseWheel(g)
  }, false);
  this.viewportElement.appendChild(this.ui);

  this.UISections = [];
  this.grid = new Array("left top", "left center", "left bottom", "center top", "center center", "center bottom", "right top", "right center", "right bottom");
  this.gridDefaults = [];
  this.gridDefaults.name = "left top";
  this.gridDefaults.levels = "left top";
  this.gridDefaults.zoom = "center bottom";
  this.gridDefaults.attribution = "left bottom";
  this.gridDefaults.compass = "right top";
  this.gridDefaults.geo = "right bottom";

  this.ui.name = null;
  this.NAME_VIEW = "conditional";
  this.NAME_POSITION = this.gridDefaults.name;

  this.ui.drawings = {};
  this.DRAWING_COLOR = "#909090";
  this.DRAWING_BG = "#ffffff";
  this.DRAWING_ACTIVE_BG = "#006bb7";
  this.DRAWING_ACTIVE_COLOR = "#ffffff";
  this.DRAWING_HOVER_BG = "#f5f4f4";
  this.DRAWING_HOVER_COLOR = "#909090";

  this.ui.zoom = null;
  this.ZOOM_VIEW = "conditional"; //"conditional" or "off" or "on";
  this.ZOOM_POSITION = this.gridDefaults.zoom;

  this.ui.levels = null;
  this.LEVELS_VIEW = "conditional";
  this.LEVELS_POSITION = this.gridDefaults.levels;
  this.LEVELS_COLOR = "#909090";
  this.LEVELS_BG = "#ffffff";
  this.LEVELS_BG_ACTIVE = "#006bb7";
  this.LEVELS_ACTIVE_COLOR = "#fff";
  this.LEVELS_HOVER_BG_COLOR = "#f5f4f4";
  this.LEVELS_HOVER_COLOR = "#909090";

  this.ui.geo = null;
  this.GEO_VIEW = false; //"conditional";
  this.GEO_SCALE_WIDTH = 55;
  this.GEO_UNITS = "standard";
  this.GEO_POSITION = this.gridDefaults.geo;
  this.GEO_UNITS_TOGGLE = "on";
  this.GEO_ORIENT_TOGGLE = "on";

  this.ui.attribution = null;
  this.ATTRIBUTION_POSITION = this.gridDefaults.attribution;

  this.ui.reg = {};
  this.backButton = null;
  this.backActive = false;
  this.createMouseShield();

  this.startX = 0;
  this.startY = 0;
  this.moveX = 0;
  this.moveY = 0;
  this.startPan = false;
  this.startZoom = false;
  this.startTarget = null;
  this.moved = false;
  this.lastTouch = null;
  this.conditionalAction = null;
  this.fadeInterval = [];
  this.fadeItems = [];
  this.heightMarker = [];
  this.widthMarker = [];
  this.data = null;
  this.view = null;
  this.mapCanvas = null
};
tMaps.MapGUI.MOVE_LIMIT = 2;
tMaps.MapGUI.CONTROL_ZINDEX = 101;
tMaps.MapGUI.POPUP_ZINDEX = 110;
tMaps.MapGUI.MIN_THRESHOLD = 400;
tMaps.MapGUI.transformName = null;
tMaps.MapGUI.originTransformName = null;
tMaps.MapGUI.detectTransformName = function (mapElement) {
  mapElement.style.webkitTransform = "scale(1.0)";
  if (mapElement.style.cssText.search("-transform") >= 0) {
    tMaps.MapGUI.setCssScale = tMaps.MapGUI.setWebkitCssScale;
    tMaps.MapGUI.setCssOrigin = tMaps.MapGUI.setWebkitCssOrigin;
    return
  }
  if (mapElement.style.MozTransform == "") {
    tMaps.MapGUI.setCssScale = tMaps.MapGUI.setMozCssScale;
    tMaps.MapGUI.setCssOrigin = tMaps.MapGUI.setMozCssOrigin;
    return
  }
  mapElement.style.msTransform = "scale(1.0)";
  if (mapElement.style.cssText.search("transform") >= 0) {
    tMaps.MapGUI.setCssScale = tMaps.MapGUI.setMsCssScale;
    tMaps.MapGUI.setCssOrigin = tMaps.MapGUI.setMsCssOrigin;
    return
  }
};
tMaps.MapGUI.prototype.onResize = function () {
  var c = this.viewportElement.offsetWidth;
  var a = this.viewportElement.offsetHeight;
  if ((this.mapCanvas.lastViewportHeight != a) || (this.mapCanvas.lastViewportWidth != c)) {
    this.mapCanvas.drawMap();
  }
  var b = this.data.getCurrentDrawing();
  this.createUI(b);
  var d = this.data.getCurrentLevel();
  this.UILevelsCorrection(d);
};
tMaps.MapGUI.prototype.onMouseDown = function (b) {
  var a = b.target;
  if ((!a) || (!a.mapTarget)) {
    return
  }
  b.cancelBubble = true;
  if (b.stopPropogation) {
    b.stopPropogation()
  }
  if (!this.view) {
    return
  }
  this.startTarget = a;
  this.shield.style.visibility = "visible";
  this.startX = b.pageX;
  this.startY = b.pageY;
  this.startPan = true;
  this.startZoom = false;
  this.moveX = 0;
  this.moveY = 0;
  mapGui.fadeOut("ui-drawings")
};
tMaps.MapGUI.prototype.onMouseUp = function (b) {
  startTarget = null;
  var a = b.target;
  if ((!a) || (!a.mapTarget)) {
    return
  }
  b.cancelBubble = true;
  if (b.stopPropogation) {
    b.stopPropogation()
  }
  this.shield.style.visibility = "hidden";
  if ((Math.abs(this.moveX) <= tMaps.MapGUI.MOVE_LIMIT) && (Math.abs(this.moveY) <= tMaps.MapGUI.MOVE_LIMIT)) {
    startTarget = this.startTarget;
    this.fireMouseClick()
  }
  this.startPan = false;
  this.startZoom = false;
  this.moved = false;
  this.startTarget = null
};
tMaps.MapGUI.prototype.onMouseOut = function (b) {
  var a = b.target;
  if ((!a) || (!a.mapTarget)) {
    return
  }
  b.cancelBubble = true;
  if (b.stopPropogation) {
    b.stopPropogation()
  }
  if (this.moved) {
    this.startPan = false;
    this.moved = false
  }
};
tMaps.MapGUI.prototype.onMouseMove = function (b) {
  var a = b.target;
  if ((!a) || (!a.mapTarget)) {
    return
  }
  b.cancelBubble = true;
  if (b.stopPropogation) {
    b.stopPropogation()
  }
  if (this.startPan) {
    this.view.translate(b.pageX - this.startX, b.pageY - this.startY);
    this.moveX += b.pageX - this.startX;
    this.moveY += b.pageY - this.startY;
    this.startX = b.pageX;
    this.startY = b.pageY;
    this.moved = true
  }
  this.conditionalUI()
};
tMaps.MapGUI.prototype.onTouchStart = function (b) {
  var c = true;
  var a;
  for (a = 0; a < b.touches.length; a++) {
    if ((!b.touches[a].target) || (!b.touches[a].target.mapTarget)) {
      c = false
    }
  }
  if (b.touches.length == 1) {
    if (!c) {
      this.startPan = false;
      this.startZoom = false;
      return
    }
    b.preventDefault();
    this.startPan = true;
    this.startZoom = false;
    this.startX = b.touches[0].clientX;
    this.startY = b.touches[0].clientY;
    this.moveX = 0;
    this.moveY = 0;
    this.startTarget = b.touches[0].target;
    this.moved = false
  } else {
    if ((b.touches.length == 2) && (c)) {
      this.startPan = false;
      this.startZoom = true;
      this.startX = (b.touches[0].clientX + b.touches[1].clientX) / 2;
      this.startY = (b.touches[0].clientY + b.touches[1].clientY) / 2;
      this.moved = false
    } else {
      this.startPan = false;
      this.startZoom = false
    }
  }
  mapGui.fadeOut("ui-drawings");
  this.conditionalUI()
};
tMaps.MapGUI.prototype.onTouchMove = function (c) {
  if ((!this.startPan) || (c.touches.length != 1)) {
    return
  }
  c.preventDefault();
  var b = c.touches[0].clientX - this.startX;
  var a = c.touches[0].clientY - this.startY;
  this.view.translate(b, a);
  this.moveX += b;
  this.moveY += a;
  this.startX = c.touches[0].clientX;
  this.startY = c.touches[0].clientY;
  this.moved = true;
  this.conditionalUI()
};
tMaps.MapGUI.prototype.onTouchEnd = function (b) {
  if (b.touches.length > 0) {
    return
  }
  b.preventDefault();
  var c = this;
  startTarget = this.startTarget;
  if ((this.startPan) && (Math.abs(this.moveX) <= tMaps.MapGUI.MOVE_LIMIT) && (Math.abs(this.moveY) <= tMaps.MapGUI.MOVE_LIMIT)) {
    var a = new Date().getTime();
    delta = a - this.lastTouch;
    if (delta < 150 && delta > 0) {
      this.zoomIn();
      clearTimeout(action)
    } else {
      this.lastTouch = a;
      action = setTimeout(function (d) {
        c.fireMouseClick();
        clearTimeout(action)
      }, 150)
    }
  }
  this.startPan = false;
  this.moved = false;
  this.startTarget = null;
  this.lastTouch = a;
  this.conditionalUI()
};
tMaps.MapGUI.prototype.onTouchCancel = function (a) {
  a.preventDefault();
  this.startPan = false;
  this.moved = false
};
tMaps.MapGUI.prototype.onGestureStart = function (a) {
  if (this.startZoom) {
    a.preventDefault()
  }
  this.conditionalUI()
};
tMaps.MapGUI.prototype.onGestureChange = function (h) {
  if (this.startZoom) {
    h.preventDefault();
    var g = h.scale;
    var b = this.startX;
    var a = this.startY;
    for (var f = this.mapElement; f != null; f = f.offsetParent) {
      b -= f.offsetLeft;
      a -= f.offsetTop
    }
    var d = 100 * b / this.mapElement.clientWidth;
    var c = 100 * a / this.mapElement.clientHeight;
    tMaps.MapGUI.setCssOrigin(this.mapElement, d, c);
    tMaps.MapGUI.setCssScale(this.mapElement, g)
  }
  this.conditionalUI()
};
tMaps.MapGUI.prototype.onGestureEnd = function (c) {
  if (!this.startZoom) {
    return
  }
  this.startZoom = false;
  var a = 0;
  var d = 0;
  for (var b = this.mapElement; b != null; b = b.offsetParent) {
    a += b.offsetLeft;
    d += b.offsetTop
  }
  zoomScale = c.scale * this.view.getZoom();
  this.zoomEnhancement(this.startX - a, this.startY - d, zoomScale, false);
  this.view.setZoom(zoomScale, this.startX - a, this.startY - d);
  this.conditionalUI()
};
tMaps.MapGUI.prototype.onKeyDown = function (a) {
  switch (a.keyCode) {
    case 187:
      a.preventDefault();
      this.zoomIn();
      break;
    case 189:
      a.preventDefault();
      this.zoomOut();
      break;
    case 40:
      a.preventDefault();
      this.view.translate(0, -15);
      break;
    case 39:
      a.preventDefault();
      this.view.translate(-15, 0);
      break;
    case 38:
      a.preventDefault();
      this.view.translate(0, 15);
      break;
    case 37:
      a.preventDefault();
      this.view.translate(15, 0);
      break
  }
};
tMaps.MapGUI.prototype.onKeyUp = function (a) {
};
tMaps.MapGUI.prototype.onMouseWheel = function (d) {
  var c = d.target;
  if (c.parentElement.id == "ui-drawings-list" || c.parentElement.className == "ui_drawing" || c.parentElement.className == "ui_drawing_name" || c.id == "ui-drawings" || c.id == "ui-drawings-container") {
    mapGui.ui.drwLst.onMouseWheel(d)
  }
  if (c.id == "ui-levels-scroll-container" || c.id == "ui-levels-scroll-button" || c.className == "ui_levels_floor" || c.className == "ui_levels_floor_name" || c.parentElement.className == "ui_levels_floor_name" || c.id == "ui-levels-floors-wrapper") {
    mapGui.ui.levelsFlrs.onMouseWheel(d)
  }
  if ((!c) || (!c.mapTarget)) {
    return
  }
  d.preventDefault();
  if (d.detail) {
    d.wheelDelta = -d.detail / 3
  }
  currScale = this.view.getZoom();
  newScale = 0;
  if (d.wheelDelta > 0) {
    newScale = currScale + 0.7
  } else {
    newScale = currScale - 0.7
  }
  var a = 0;
  var f = 0;
  for (var b = this.mapElement; b != null; b = b.offsetParent) {
    a += b.offsetLeft;
    f += b.offsetTop
  }
  this.zoomEnhancement(d.clientX - a, d.clientY - f, newScale, false);
  this.view.setZoom(newScale, d.clientX - a, d.clientY - f);
  this.conditionalUI()
};
tMaps.MapGUI.prototype.zoomEnhancement = function (d, c, f, g) {
  this.NAME_ENTITY_ENHANCEMENT = "off";
  if (this.NAME_ENTITY_ENHANCEMENT == "off") {
    return
  }
  var k = this.view.canvasToMapX(d, c);
  var j = this.view.canvasToMapY(d, c);
  var h = this.data.getCurrentLevel();
  var m = this.data.getCurrentDrawing();
  var a = this.data.getCommunity();
  geomClick = this.mapCanvas.hitCheck(h.g, k, j);
  if (this.NAME_VIEW != "off") {
    if (geomClick) {
      if (geomClick.nm) {
        this.ui.name.innerHTML = m.nm + '<div id="ui-entity-enhancement">' + geomClick.nm + "</div>"
      } else {
        this.ui.name.innerHTML = m.nm
      }
    } else {
      this.ui.name.innerHTML = m.nm
    }
  }
  if (g && geomClick) {
    if (f > 10) {
      if (geomClick.did) {
        for (var b = 0; b < a.d.length; b++) {
          if (a.d[b].id == geomClick.did) {
            this.view.setZoom(2, d, c);
            mapGui.setDrawing(a.d[b])
          }
        }
      }
    }
  }
};
tMaps.MapGUI.prototype.fireMouseClick = function () {
  var a = 0;
  var d = 0;
  this.startTarget = startTarget;
  for (var b = this.mapElement; b != null; b = b.offsetParent) {
    a += b.offsetLeft;
    d += b.offsetTop
  }
  var c;
  if (this.startTarget) {
    c = this.startTarget.mapObject
  }
  if (this.mapCanvas) {
    this.mapCanvas.clickMouse(this.startX - a, this.startY - d, c)
  }
};
tMaps.MapGUI.prototype.zoomIn = function () {
  if (this.view) {
    cntrPointX = this.viewportElement.offsetWidth / 2 - this.view.mapXInViewport;
    cntrPointY = this.viewportElement.offsetHeight / 2 - this.view.mapYInViewport;
    zoomScale = this.view.getZoom();
    this.zoomEnhancement(cntrPointX, cntrPointY, zoomScale, false);
    this.view.zoomIn()
  }
};
tMaps.MapGUI.prototype.zoomOut = function () {
  if (this.view) {
    cntrPointX = this.viewportElement.offsetWidth / 2 - this.view.mapXInViewport;
    cntrPointY = this.viewportElement.offsetHeight / 2 - this.view.mapYInViewport;
    zoomScale = this.view.getZoom();
    this.zoomEnhancement(cntrPointX, cntrPointY, zoomScale, false);
    this.view.zoomOut()
  }
};
tMaps.MapGUI.prototype.setLevel = function (a) {
  if (this.data) {
    this.data.setLevel(a)
  }
};
tMaps.MapGUI.prototype.setDrawing = function (a) {
  if (this.data) {
    if (a != this.data.getCurrentDrawing()) {
      this.data.setDrawing(a)
    }
  }
};
tMaps.MapGUI.prototype.createMouseShield = function () {
  this.shield = document.createElement("div");
  var a = this.viewportElement;
  while (a.offsetParent) {
    a = a.offsetParent
  }
  a.appendChild(this.shield);
  this.shield.setAttribute("class", "map-shield");
  this.shield.mapTarget = true;

  var mapGui = this;
  this.shield.onmousedown = function (d) {
    mapGui.onMouseDown(d)
  };
  this.shield.onmouseup = function (d) {
    mapGui.onMouseUp(d)
  };
  this.shield.onmousemove = function (d) {
    mapGui.onMouseMove(d)
  };
  this.shield.onmouseout = function (d) {
    mapGui.onMouseOut(d)
  }
};
tMaps.MapGUI.prototype.updateLevel = function (a) {
  this.UILevelsCorrection(a)
};
tMaps.MapGUI.prototype.updateDrawing = function (currentDrawing) {
  this.createUI(currentDrawing)
};
tMaps.MapGUI.prototype.closeCommunity = function () {
  this.destroyUI()
};
tMaps.MapGUI.setCssScale = null;
tMaps.MapGUI.setCssOrigin = null;
tMaps.MapGUI.setWebkitCssScale = function (a, b) {
  a.style.webkitTransform = "scale(" + b + ")"
};
tMaps.MapGUI.setMozCssScale = function (a, b) {
  a.style.MozTransform = "scale(" + b + ")"
};
tMaps.MapGUI.setMsCssScale = function (a, b) {
  a.style.msTransform = "scale(" + b + ")"
};
tMaps.MapGUI.setWebkitCssOrigin = function (b, c, a) {
  b.style.webkitTransformOrigin = c + "% " + a + "%"
};
tMaps.MapGUI.setMozCssOrigin = function (b, c, a) {
  b.style.MozTransformOrigin = c + "% " + a + "%"
};
tMaps.MapGUI.setMsCssOrigin = function (b, c, a) {
  b.style.msTransformOrigin = c + "% " + a + "%"
};
tMaps.MapGUI.prototype.createUI = function (currentDrawing) {
  community = this.data.getCommunity();
  this.UISections = [];
  this.UIName(community);
  this.UIZoom(community);
  this.UILevels(currentDrawing);
  this.UIGeo(currentDrawing, community);
  this.determinePosition();
  this.UIDrawings(currentDrawing);
};
tMaps.MapGUI.prototype.destroyUI = function (a) {
  this.removeElement("ui-name");
  this.removeElement("ui-drawings");
  this.removeElement("ui-drawings-icon");
  this.removeElement("ui-zoom");
  this.removeElement("ui-levels");
  this.removeElement("ui-attribution");
  this.removeElement("ui-geo")
};
tMaps.MapGUI.prototype.UIGeo = function (currentDrawing, community) {
  this.removeElement("ui-geo");
  if (this.GEO_VIEW != "on" && this.GEO_VIEW != "conditional") {
    return false
  }
  this.ui.geo = document.createElement("div");
  this.ui.geo.setAttribute("id", "ui-geo");
  this.ui.geo.className = "ui_element";
  this.ui.geo.style.width = "105px";
  this.ui.geo.style.fontFamily = this.UI_FONT + ", " + this.UI_FONT_FALLBACK;
  this.determinePositionArraySetup("geo", this.GEO_POSITION, 100, 15);
  this.ui.appendChild(this.ui.geo);
  this.UIReg("ui-geo", this.GEO_VIEW);
  this.ui.map_scale = document.createElement("div");
  this.ui.map_scale.setAttribute("id", "ui_scale");
  this.ui.map_scale.style.borderBottom = "1px solid #999";
  this.ui.map_scale.style.position = "absolute";
  this.ui.map_scale.style.bottom = "4px";
  this.ui.map_scale.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 4;
  this.ui.map_scale_text = document.createElement("p");
  this.ui.map_scale_text.setAttribute("id", "ui-scale-text");
  this.ui.map_scale_text.style.color = "#999";
  this.ui.map_scale_text.style.fontWeight = "bold";
  this.ui.map_scale_text.style.margin = "0px";
  this.ui.map_scale_text.style.textAlign = "center";
  this.updateMapScale(currentDrawing);
  this.ui.map_scale.appendChild(this.ui.map_scale_text);
  this.ui.geo.appendChild(this.ui.map_scale);
  if (this.GEO_UNITS_TOGGLE == "on") {
    this.ui.map_scale.style.cursor = "pointer";
    var c = this;
    changeUnits = function () {
      if (c.GEO_UNITS == "standard") {
        c.GEO_UNITS = "metric"
      } else {
        c.GEO_UNITS = "standard"
      }
      c.updateMapScale(currentDrawing)
    };
    this.ui.map_scale.onclick = function () {
      changeUnits()
    };
    this.ui.map_scale.ontouchstart = function (h) {
      h.preventDefault();
      changeUnits()
    }
  }
  if (this.view.customView) {
    this.ui.geo.style.width = "60px";
    return false
  }
  if (this.GEO_ORIENT_TOGGLE == "on") {
    this.ui.compass.style.cursor = "pointer";
    this.ui.compass.title = "Change Orientation";
    var c = this;
    var b = function (j, h) {
      delete c.compassCache;
      if (h.northAtTop) {
        h.northAtTop = false
      } else {
        h.northAtTop = true
      }
      j.setDrawing(j.currentDrawing, j.currentLevel.id)
    };
    var g = this.data;
    var d = this.mapControl.view;
    this.ui.compass.onclick = function () {
      b(g, d)
    };
    this.ui.compass.ontouchstart = function (h) {
      h.preventDefault();
      b(g, d)
    }
  }
};
tMaps.MapGUI.prototype.updateMapScale = function (z) {
  var p = (z.t[1] * 0) + (z.t[3] * 0) + (z.t[5]);
  var u = (z.t[0] * 0) + (z.t[2] * 0) + (z.t[4]);
  var v = (z.t[1] * z.w) + (z.t[3] * z.h) + (z.t[5]);
  var s = (z.t[0] * z.w) + (z.t[2] * z.h) + (z.t[4]);
  var m;
  var r;
  var b;
  var k;
  switch (this.GEO_UNITS) {
    case "standard":
      this.ui.map_scale.title = "Switch to Metric";
      m = 3959;
      b = 5280;
      r = "ft";
      k = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 100, 200, 500];
      break;
    case "metric":
      this.ui.map_scale.title = "Switch to Standard";
      m = 6371;
      b = 1000;
      r = "m";
      k = [1, 3, 5, 10, 20, 30, 40, 50, 100];
      break;
    default:
      m = 3959;
      b = 5280;
      r = "ft";
      k = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 100, 200, 500]
  }
  var n = (Math.PI / 180);
  var q = (v - p) * n;
  var o = (s - u) * n;
  var j = p * n;
  var g = v * n;
  var y = Math.sin(q / 2) * Math.sin(q / 2) + Math.sin(o / 2) * Math.sin(o / 2) * Math.cos(j) * Math.cos(g);
  var x = 2 * Math.atan2(Math.sqrt(y), Math.sqrt(1 - y));
  var w = m * x;
  var f = Math.sqrt(Math.pow(z.w, 2) + Math.pow(z.h, 2));
  var h = (((w / f) / this.view.scale) * this.GEO_SCALE_WIDTH) * b;
  var t = 0;
  for (var y in k) {
    if (h > k[y]) {
      t = k[y];
      continue
    } else {
      break
    }
  }
  if (t == 0) {
    this.ui.map_scale.style.display = "none"
  } else {
    this.ui.map_scale.style.width = (this.GEO_SCALE_WIDTH / (h / t)) + "px";
    this.ui.map_scale_text.innerHTML = t + "" + r
  }
};
tMaps.MapGUI.prototype.drawCompass = function (d, c) {
  var g = c.width / this.ui.COMPASS_MAX;
  var f = c.getContext("2d");
  f.translate(c.width / 2, c.height / 2);
  var a = new Image();
  a.src = tMaps.settings.SCRIPT_URL + "resources/compass_n.png";
  var h = (this.view.northAtTop) ? true : false;
  a.onload = function () {
    var b = a.width * g;
    var k = a.height * g;
    f.drawImage(a, b / -2, k / -2, b, k);
    if (!h) {
      f.rotate(-d)
    }
    var j = new Image();
    j.src = tMaps.settings.SCRIPT_URL + "resources/compass_arrow4.png";
    j.onload = function () {
      var m = j.width * g;
      var n = j.height * g;
      f.drawImage(j, m / -2, n / -2, m, n)
    }
  }
};
tMaps.MapGUI.prototype.UIName = function (community) {
  this.removeElement("ui-name");
  this.removeElement("ui-drawings");
  this.removeElement("ui-drawings-icon");
  if (this.NAME_VIEW != "on" && this.NAME_VIEW != "conditional") {
    return false
  }
  this.ui.NAME_MAX = 18;
  this.ui.NAME_MIN = 11;
  var viewportClientWidth = this.viewportElement.clientWidth;
  this.ui.name = document.createElement("div");
  this.ui.name.setAttribute("id", "ui-name");
  this.ui.name.className = "ui_element";
  this.ui.name.style.whiteSpace = "pre";
  var c = viewportClientWidth * 0.04;
  if (c > this.ui.NAME_MAX) {
    c = this.ui.NAME_MAX
  }
  if (c < this.ui.NAME_MIN) {
    c = this.ui.NAME_MIN
  }
  this.ui.nameTxt = document.createElement("div");
  this.ui.nameTxt.setAttribute("id", "ui-name-text");
  this.ui.nameTxt.style.color = this.NAME_COLOR;
  this.ui.nameTxt.innerHTML = community.nm;
  this.ui.name.appendChild(this.ui.nameTxt);
  this.ui.appendChild(this.ui.name);
  this.UIReg("ui-name", this.NAME_VIEW)
};
tMaps.MapGUI.prototype.UIDrawings = function (currentDrawing) {
  if (this.NAME_VIEW != "on" && this.NAME_VIEW != "conditional") {
    this.ui.DRAWINGS_VIEW = "off";
    return false
  }
  mapData = this.data;
  community = this.data.getCommunity();
  if (community.d.length < 2) {
    this.ui.DRAWINGS_VIEW = "off";
    return false
  }
  this.ui.HEIGHTINCREMENT_MAX = 50;
  this.ui.HEIGHTINCREMENT_MIN = 40;
  var clientHeight = this.viewportElement.clientHeight;
  mapGui = this;
  var ui = this.ui;
  heightManager = 0;
  heightIncrement = Math.round(clientHeight * 0.05);
  if (heightIncrement > this.ui.HEIGHTINCREMENT_MAX) {
    heightIncrement = this.ui.HEIGHTINCREMENT_MAX
  }
  if (heightIncrement < this.ui.HEIGHTINCREMENT_MIN) {
    heightIncrement = this.ui.HEIGHTINCREMENT_MIN
  }
  if (community.d.length > 2) {
    drwShow = heightIncrement * 3
  } else {
    drwShow = heightIncrement * 2
  }
  iconWidth = 30;
  iconHeight = 30;
  iconBuffer = iconWidth / 2;
  lvlArwWdth = 15;
  totalMoved = 0;
  downSpace = this.availSpace(this.NAME_POSITION, "h");
  widthSpace = this.availSpace(this.NAME_POSITION, "w");
  var b = false;
  ui = this.ui;
  this.ui.name.style.cursor = "pointer";
  this.ui.name.style.height = iconHeight + "px";
  this.ui.drawings = document.createElement("div");
  this.ui.drawings.setAttribute("id", "ui-drawings");
  this.ui.drawings.className = "ui_element";
  this.ui.drawings.style.top = this.ui.name.offsetTop + iconHeight + iconHeight * 0.25 + "px";
  this.ui.drawings.style.display = "none";
  this.ui.drawings.style.fontFamily = this.UI_FONT + ", " + this.UI_FONT_FALLBACK;
  this.ui.drwCtr = document.createElement("div");
  this.ui.drwCtr.setAttribute("id", "ui-drawings-container");
  this.ui.drwCtr.className = "roundTop roundBottom ";
  if (iconWidth + iconBuffer + this.ui.name.offsetWidth > this.viewportElement.clientWidth - widthSpace.taken) {
    drwWidth = this.viewportElement.clientWidth - widthSpace.taken
  } else {
    drwWidth = (this.ui.name.offsetWidth + iconWidth + iconBuffer) - lvlArwWdth
  }
  this.ui.drawings.style.width = drwWidth + "px";
  this.ui.drawings.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 4;
  this.ui.drwCtr.style.width = drwWidth + "px";
  this.ui.drwCtr.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 4;
  drwLstWidth = drwWidth + "px";
  this.ui.drwLst = document.createElement("div");
  this.ui.drwLst.setAttribute("id", "ui-drawings-list");
  this.ui.drwLst.style.width = drwLstWidth;
  this.ui.drwLst.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 3;
  var community;
  this.ui.drwLstEventHandler = function (j) {
    community = mapData.getCommunity();
    for (var h = 0; h < community.d.length; h++) {
      if (j == community.d[h].id) {
        mapGui.fadeOut("ui-drawings");
        mapGui.setDrawing(community.d[h])
      }
    }
  };
  drwLstClkEventHandler = function (h) {
    return function () {
      ui.drwLstEventHandler(h)
    }
  };
  drawingItem = null;
  for (var i = 0; i < community.d.length; i++) {
    drawingItem = document.createElement("div");
    drawingItem.setAttribute("id", "ui-drawings-" + community.d[i].id);
    drawingItem.setAttribute("drawing", community.d[i].id);
    drawingItem.className = "ui_drawing";
    drawingItem.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 2;
    drawingItem.style.height = heightIncrement + "px";
    drawingItem.style.top = heightManager + "px";
    heightManager += heightIncrement;
    drawingItem.style.left = 0;
    drawingItem.style.width = drwLstWidth;
    drawingItem.style.borderBottom = "1px solid #999";
    if (currentDrawing.id == community.d[i].id) {
      drawingItem.style.backgroundColor = this.DRAWING_ACTIVE_BG;
      drawingItem.style.color = this.DRAWING_ACTIVE_COLOR
    } else {
      drawingItem.style.backgroundColor = this.DRAWING_BG;
      drawingItem.style.color = this.DRAWING_COLOR;
      drawingItem.onmouseover = function (h) {
        this.style.backgroundColor = mapGui.DRAWING_HOVER_BG;
        this.style.color = mapGui.DRAWING_HOVER_COLOR
      };
      drawingItem.onmouseout = function (h) {
        this.style.backgroundColor = mapGui.DRAWING_BG;
        this.style.color = mapGui.DRAWING_COLOR
      }
    }
    drawingName = document.createElement("div");
    drawingName.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 1;
    drawingName.setAttribute("drawing", community.d[i].id);
    drawingName.innerHTML = community.d[i].nm;
    drawingName.className = "ui_drawing_name";
    drawingName.style.top = heightIncrement / 4 + "px";
    drawingName.style.left = "3px";
    drawingItem.appendChild(drawingName);
    drawingItem.onclick = drwLstClkEventHandler(community.d[i].id);
    this.ui.drwLst.appendChild(drawingItem)
  }
  this.ui.drawings.style.height = drwShow + heightIncrement + "px";
  this.ui.drwCtr.style.height = drwShow + "px";
  this.ui.drwLst.style.height = heightManager + "px";
  this.ui.drawings.style.fontSize = this.ui.name.style.fontSize;
  this.ui.drawings.appendChild(this.ui.drwLst);
  this.ui.appendChild(this.ui.drawings);
  this.ui.drwIcn = document.createElement("div");
  this.ui.drwIcn.setAttribute("id", "ui-drawings-icon");
  this.ui.drwIcn.style.border = "1px solid #999";
  this.ui.drwIcn.style.backgroundColor = "#fff";
  this.ui.drwIcn.style.width = iconWidth + "px";
  this.ui.drwIcn.style.height = iconHeight + "px";
  this.ui.drwIcn.className = "ui_element";
  this.ui.drwIcnImg = document.createElement("img");
  this.ui.drwIcnImg.src = tMaps.settings.SCRIPT_URL + "resources/drawingsIcon.png";
  this.ui.drwIcnImg.style.width = "50%";
  this.ui.drwIcnImg.style.height = "50%";
  this.ui.drwIcnImg.style.position = "absolute";
  this.ui.drwIcnImg.style.top = iconHeight / 2.8 + "px";
  this.ui.drwIcnImg.style.left = iconWidth / 3.9 + "px";
  this.ui.drwIcn.appendChild(this.ui.drwIcnImg);
  drwLstSetHandler = function () {
    return function () {
      mapGui.fadeIn("ui-drawings")
    }
  };
  drwAction = setTimeout(function (h) {
    mapGui.ui.drwIcn.ontouchend = drwLstSetHandler();
    mapGui.ui.name.ontouchend = drwLstSetHandler();
    mapGui.ui.name.onmouseover = drwLstSetHandler();
    mapGui.ui.drwIcn.onmouseover = drwLstSetHandler();
    clearTimeout(drwAction)
  }, 200);
  this.ui.drwIcn.style.top = this.ui.name.style.top;
  if (this.NAME_POSITION == "left top") {
    this.ui.drwIcn.style.left = this.ui.name.offsetLeft + "px";
    this.ui.drawings.style.left = this.ui.name.offsetLeft + "px";
    this.ui.name.style.left = this.ui.name.offsetLeft + (iconWidth + iconBuffer) + "px";
    if (this.ui.name.offsetWidth + iconWidth + iconBuffer > this.viewportElement.clientWidth - widthSpace.taken) {
      this.ui.name.style.width = (this.viewportElement.clientWidth - widthSpace.taken) - (this.viewportElement.clientWidth * 0.025) - (iconWidth + iconBuffer) + "px";
      this.ui.nameTxt.style.width = this.ui.name.style.width;
      this.ui.name.style.whiteSpace = ""
    }
  }
  if (this.NAME_POSITION == "right top") {
    this.ui.name.style.left = this.ui.name.offsetLeft - (iconWidth + iconBuffer) + "px";
    this.ui.drawings.style.left = this.ui.name.offsetLeft + "px";
    this.ui.drwIcn.style.left = this.ui.name.offsetLeft + this.ui.name.offsetWidth + iconBuffer + "px";
    if (this.ui.name.offsetWidth + iconWidth + iconBuffer > this.viewportElement.clientWidth - widthSpace.taken) {
      this.ui.name.style.width = this.viewportElement.clientWidth - widthSpace.taken - (this.viewportElement.clientWidth * 0.025) - (iconWidth + iconBuffer) + "px";
      this.ui.nameTxt.style.width = this.ui.name.style.width;
      this.ui.name.style.left = widthSpace.taken + "px";
      this.ui.drawings.style.left = widthSpace.taken + "px";
      this.ui.drawings.style.width = this.ui.name.offsetWidth + iconWidth + "px";
      this.ui.drwIcn.style.left = this.ui.name.offsetLeft + this.ui.name.offsetWidth + iconBuffer + "px";
      this.ui.name.style.whiteSpace = ""
    }
    this.ui.drwCtr.style.left = lvlArwWdth + "px";
    this.ui.drwLst.style.width = this.ui.drawings.style.width;
    this.ui.drwCtr.style.width = this.ui.drawings.style.width
  }
  this.ui.drwLst.ondragstart = function () {
    return false
  };
  this.ui.drwLst.onMouseWheel = function (h) {
    h.preventDefault();
    ui = mapGui.ui;
    if (h.detail) {
      h.wheelDelta = -h.detail / 3
    }
    if (h.wheelDelta < 0) {
      newScale = ui.drwLst.offsetTop - heightIncrement / 2
    } else {
      newScale = ui.drwLst.offsetTop + heightIncrement / 2
    }
    ui.drwLst.style.left = 0;
    ui.drwLst.style.top = newScale + "px";
    mapGui.UIDrawingListContain(ui);
    mapGui.UIDrawingArrowToggle();
    mapGui.conditionalUI()
  };
  viewportElement = this.viewportElement;
  this.ui.drawings.ontouchstart = function (h) {
    h.preventDefault();
    h.stopPropagation();
    startPos = h.touches[0].pageY;
    b = true;
    totalMoved = 0
  };
  this.ui.drawings.ontouchmove = function (h) {
    if (h.touches.length == 1) {
      h.preventDefault();
      var j = h.touches[0];
      ui.drwLst.style.left = 0;
      fingerMoved = startPos - j.pageY;
      totalMoved += fingerMoved;
      startPos = j.pageY;
      ui.drwLst.style.top = ui.drwLst.offsetTop - fingerMoved + "px";
      mapGui.UIDrawingListContain(ui);
      mapGui.UIDrawingArrowToggle();
      mapGui.conditionalUI()
    }
  };
  this.ui.drawings.ontouchend = function (j) {
    if ((b) && (Math.abs(totalMoved) <= tMaps.MapGUI.MOVE_LIMIT)) {
      var h = j.target.getAttribute("drawing");
      if (h) {
        ui.drwLstEventHandler(h)
      }
    }
    b = false
  };
  this.ui.drawings.appendChild(this.ui.drwCtr);
  this.ui.drwCtr.appendChild(this.ui.drwLst);
  this.ui.appendChild(this.ui.drwIcn);
  this.ui.nameTxt.innerHTML = currentDrawing.nm;
  this.ui.drawings.currDraw = currentDrawing.id;
  this.UIDrawingArrow();
  this.UIReg("ui-drawings-icon", this.NAME_VIEW);
  if (this.NAME_VIEW == "conditional") {
    this.UIReg("ui-drawings", "conditional_hidden")
  }
};
tMaps.MapGUI.prototype.UIDrawingListContain = function (a) {
  if (a.drwLst.offsetTop > 0) {
    a.drwLst.style.top = "0px"
  }
  if ((a.drwLst.offsetTop + a.drwLst.offsetHeight) <= (a.drwCtr.offsetTop + a.drwCtr.offsetHeight)) {
    a.drwLst.style.top = (a.drwCtr.offsetTop + a.drwCtr.offsetHeight) - a.drwLst.offsetHeight + "px"
  }
};
tMaps.MapGUI.prototype.UIDrawingArrow = function () {
  mapGui = this;
  ui = this.ui;
  this.ui.drwArwUp = document.createElement("div");
  this.ui.drwArwUp.setAttribute("id", "ui-drawings-arrow-up");
  this.ui.drwArwUp.style.width = lvlArwWdth + "px";
  this.ui.drwArwUp.style.top = "0px";
  if (this.NAME_POSITION == "right top") {
    this.ui.drwArwUp.style.left = "0px"
  } else {
    this.ui.drwArwUp.style.left = drwWidth + "px"
  }
  this.ui.drwArwUp.style.height = "40px";
  this.ui.drwArwUp.style.display = "none";
  this.ui.drwArwUp.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 6;
  this.ui.drawings.appendChild(this.ui.drwArwUp);
  this.ui.drwArwUpImg = document.createElement("img");
  this.ui.drwArwUpImg.src = tMaps.settings.SCRIPT_URL + "resources/arrowUp.png";
  this.ui.drwArwUpImg.style.width = "60%";
  this.ui.drwArwUpImg.style.position = "absolute";
  this.ui.drwArwUpImg.style.top = "0px";
  this.ui.drwArwUpImg.style.left = "5px";
  this.ui.drwArwUp.appendChild(this.ui.drwArwUpImg);
  this.ui.drwArwUp.onclick = function (a) {
    newScale = ui.drwLst.offsetTop + heightIncrement / 2;
    ui.drwLst.style.left = 0;
    ui.drwLst.style.top = newScale + "px";
    mapGui.UIDrawingListContain(ui);
    mapGui.UIDrawingArrowToggle()
  };
  this.ui.drwArwDn = document.createElement("div");
  this.ui.drwArwDn.setAttribute("id", "ui-drawings-arrow-down");
  this.ui.drwArwDn.style.width = lvlArwWdth + "px";
  this.ui.drwArwDn.style.top = drwShow - 20 + "px";
  if (this.NAME_POSITION == "right top") {
    this.ui.drwArwDn.style.left = "0px"
  } else {
    this.ui.drwArwDn.style.left = drwWidth + "px"
  }
  this.ui.drwArwDn.style.height = "40px";
  this.ui.drwArwDn.style.display = "none";
  this.ui.drwArwDn.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 6;
  this.ui.drawings.appendChild(this.ui.drwArwDn);
  this.ui.drwArwDnImg = document.createElement("img");
  this.ui.drwArwDnImg.src = tMaps.settings.SCRIPT_URL + "resources/arrowDwn.png";
  this.ui.drwArwDnImg.style.width = "60%";
  this.ui.drwArwDnImg.style.height = "60%";
  this.ui.drwArwDnImg.style.position = "absolute";
  this.ui.drwArwDnImg.style.top = "0px";
  this.ui.drwArwDnImg.style.left = "5px";
  this.ui.drwArwDn.appendChild(this.ui.drwArwDnImg);
  this.ui.drwArwDn.onclick = function (a) {
    newScale = ui.drwLst.offsetTop - heightIncrement / 2;
    ui.drwLst.style.left = 0;
    ui.drwLst.style.top = newScale + "px";
    mapGui.UIDrawingListContain(ui);
    mapGui.UIDrawingArrowToggle()
  };
  this.UIDrawingArrowToggle()
};
tMaps.MapGUI.prototype.UIDrawingArrowToggle = function () {
  mapGui = this;
  if (heightManager > drwShow && (this.ui.drwLst.offsetTop + heightManager) != (this.ui.drwCtr.offsetTop + this.ui.drwCtr.offsetHeight)) {
    this.UIDrawingCond = setTimeout(function (a) {
      mapGui.fadeIn("ui-drawings-arrow-down");
      clearTimeout(mapGui.UIDrawingCond)
    }, 750)
  } else {
    this.UIDrawingCond = setTimeout(function (a) {
      mapGui.fadeOut("ui-drawings-arrow-down");
      clearTimeout(mapGui.UIDrawingCond)
    }, 750)
  }
  if (this.ui.drwLst.offsetTop < 0) {
    this.UIDrawingCond = setTimeout(function (a) {
      mapGui.fadeIn("ui-drawings-arrow-up");
      clearTimeout(mapGui.UIDrawingCond)
    }, 750)
  } else {
    this.UIDrawingCond = setTimeout(function (a) {
      mapGui.fadeOut("ui-drawings-arrow-up");
      clearTimeout(mapGui.UIDrawingCond)
    }, 750)
  }
};
tMaps.MapGUI.prototype.UIZoom = function (community) {
  this.removeElement("ui-zoom");
  if (this.ZOOM_VIEW != "on" && this.ZOOM_VIEW != "conditional") {
    return false
  }
  var ui = this.ui;
  ui.zoom = document.createElement("div");
  ui.zoom.setAttribute("id", "ui-zoom");
  ui.zoom.className = "ui_element";
  ui.zmIn = document.createElement("div");
  ui.zmIn.setAttribute("id", "ui-zoom-in");
  ui.zmIn.style.overflow = "hidden";
  ui.zmIn.innerHTML = "+";
  ui.zoom.appendChild(this.ui.zmIn);
  ui.zmOut = document.createElement("div");
  ui.zmOut.setAttribute("id", "ui-zoom-out");
  ui.zmOut.innerHTML = "-";
  ui.zoom.appendChild(this.ui.zmOut);
  ui.zmIn.onclick = function (j) {
    mapGui.zoomIn();
    var h = j;
  };
  ui.zmIn.ontouchstart = function (h) {
    h.preventDefault();
  };
  ui.zmIn.ontouchend = function (h) {
    h.preventDefault();
    mapGui.zoomIn()
  };
  ui.zmOut.onclick = function (j) {
    mapGui.zoomOut();
    var h = j;
  };
  ui.zmOut.ontouchstart = function (h) {
    h.preventDefault();
  };
  ui.zmOut.ontouchend = function (h) {
    h.preventDefault();
    mapGui.zoomOut()
  };
  ui.appendChild(this.ui.zoom);
  this.UIReg("ui-zoom", this.ZOOM_VIEW);
  return true
};
tMaps.MapGUI.prototype.UILevels = function (currentDrawing) {
  this.removeElement("ui-levels");
  if (currentDrawing.l.length == 1) {
    return
  }
  if (this.LEVELS_VIEW != "on" && this.LEVELS_VIEW != "conditional") {
    return false
  }
  community = this.data.getCommunity();
  this.ui.levels = document.createElement("div");
  this.ui.levels.setAttribute("id", "ui-levels");
  this.ui.levels.className = "ui_element";
  this.ui.levels.style.fontFamily = this.UI_FONT + ", " + this.UI_FONT_FALLBACK;
  var ui = this.ui;
  this.UILevelsLarge(currentDrawing, ui);
  this.determinePositionArraySetup("levels", this.LEVELS_POSITION, 200, 15);
  this.ui.appendChild(this.ui.levels);
  this.UIReg("ui-levels", this.LEVELS_VIEW)
};
tMaps.MapGUI.prototype.UILevelsContain = function () {
  if (this.ui.levelsFlrs.offsetTop > 0) {
    this.ui.levelsFlrs.style.top = "0px"
  }
  if ((this.ui.levelsFlrs.offsetTop + this.ui.levelsFlrs.offsetHeight) <= (this.ui.levelsWrp.offsetTop + this.ui.levelsWrp.offsetHeight)) {
    this.ui.levelsFlrs.style.top = (this.ui.levelsWrp.offsetTop + this.ui.levelsWrp.offsetHeight) - this.ui.levelsFlrs.offsetHeight + "px"
  }
};
tMaps.MapGUI.prototype.UILevelsCorrection = function (g) {
  mapGui = this;
  if (this.LEVELS_VIEW != "on" && this.LEVELS_VIEW != "conditional") {
    return false
  }
  if (!this.ui.levels) {
    return false
  }
  var a = this.viewportElement.clientHeight;
  var b = this.ui.levels.offsetTop;
  var c = this.ui.levels.offsetHeight;
  var f;
  nodeList = document.getElementsByClassName("ui_levels_floor");
  for (cnt = 0; cnt < nodeList.length; cnt++) {
    nodeList[cnt].style.backgroundColor = mapGui.LEVELS_BG;
    nodeList[cnt].style.color = mapGui.LEVELS_COLOR;
    mapGui.addClass(nodeList[cnt], "ui_levels_unselected")
  }
  element = document.getElementById("ui-levels-floor-" + g.id);
  if (element) {
    mapGui.removeClass(element, "ui_levels_unselected");
    element.style.backgroundColor = mapGui.LEVELS_BG_ACTIVE;
    element.style.color = mapGui.LEVELS_ACTIVE_COLOR
  }
  f = this.availSpace(this.LEVELS_POSITION, "h");
  var d = (a - b) - (f.taken + f.taken * 0.9);
  if (d < floorHeight * 2) {
    d = floorHeight * 2
  }
  if (c > d) {
    lvlFlrH = d;
    this.ui.levels.style.height = lvlFlrH + "px";
    this.ui.levels.style.height = lvlFlrH + "px";
    this.ui.levelsCtr.style.height = lvlFlrH + "px";
    this.ui.levelsWrp.style.height = lvlFlrH + "px";
    this.ui.lvlArwDn.style.top = lvlFlrH - 20 + "px";
    this.UILevelArrowToggleCond = setTimeout(function (h) {
      mapGui.UILevelArrowToggle();
      clearTimeout(mapGui.UILevelArrowToggleCond)
    }, 1000)
  }
};
tMaps.MapGUI.prototype.UILevelsLarge = function (currentDrawing, ui) {
  ui.LEVELS_V_MAX_WIDTH = 50;
  ui.LEVELS_V_MAX_HEIGHT = 250;
  ui.LEVELS_V_MIN_WIDTH = 50;
  ui.LEVELS_V_MIN_HEIGHT = 150;
  var a = this.viewportElement.clientHeight;
  var f = a * 0.45;
  var c = 0;
  if (f > ui.LEVELS_V_MAX_HEIGHT) {
    f = ui.LEVELS_V_MAX_HEIGHT
  }
  if (f < ui.LEVELS_V_MIN_HEIGHT) {
    f = ui.LEVELS_V_MIN_HEIGHT
  }
  c = f / 4;
  if (c > ui.LEVELS_V_MAX_WIDTH) {
    c = ui.LEVELS_V_MAX_WIDTH
  }
  if (c < ui.LEVELS_V_MIN_WIDTH) {
    c = ui.LEVELS_V_MIN_WIDTH
  }
  floorHeight = 35;
  floorHeightManager = 0;
  lvlFlrH = floorHeight * currentDrawing.l.length;
  lvlWidth = 30;
  lvlWrpWidth = lvlWidth;
  lvlStartScroll = false;
  startLvlScroll = false;
  lvlClick = false;
  lvlBtnScroll = false;
  arwWdth = 15;
  mapGui = this;
  mapData = this.data;
  nameShortened = null;
  ui = this.ui;
  ui.levels.style.width = c + "px";
  ui.levels.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 1;
  ui.levelsCtr = document.createElement("div");
  ui.levelsCtr.setAttribute("id", "ui-levels-floors-container");
  ui.levelsCtr.style.width = lvlWrpWidth + "px";
  ui.levels.appendChild(ui.levelsCtr);
  ui.levelsWrp = document.createElement("div");
  ui.levelsWrp.setAttribute("id", "ui-levels-floors-wrapper");
  ui.levelsWrp.style.width = lvlWrpWidth + "px";
  ui.levelsWrp.className += " roundTop roundBottom";
  if (this.LEVELS_POSITION == "right top") {
    ui.levelsWrp.style.left = arwWdth + "px"
  } else {
    ui.levelsWrp.style.left = "0px"
  }
  ui.levelsWrp.style.border = "1px solid " + this.LEVELS_COLOR;
  ui.levels.appendChild(ui.levelsWrp);
  ui.levelsFlrs = document.createElement("div");
  ui.levelsFlrs.setAttribute("id", "ui-levels-floors");
  ui.levelsFlrs.style.color = this.LEVELS_COLOR;
  ui.levelsFlrs.style.width = lvlWrpWidth + "px";
  ui.levelsFlrs.style.left = 0;
  ui.levelsFlrs.style.top = 0;
  ui.levelsFlrs.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 2;
  ui.levelsWrp.appendChild(ui.levelsFlrs);
  ui.lvlLstEventHandler = function (g) {
    nodeList = document.getElementsByClassName("ui_levels_floor");
    for (cnt = 0; cnt < nodeList.length; cnt++) {
      nodeList[cnt].style.backgroundColor = mapGui.LEVELS_BG;
      nodeList[cnt].style.color = mapGui.LEVELS_COLOR;
      mapGui.addClass(nodeList[cnt], "ui_levels_unselected")
    }
    currDraw = mapData.getCurrentDrawing();
    for (cnt = 0; cnt < currDraw.l.length; cnt++) {
      element = document.getElementById("ui-levels-floor-" + g);
      if (currDraw.l[cnt].id == g) {
        mapGui.setLevel(currDraw.l[cnt]);
        mapGui.removeClass(element, "ui_levels_unselected");
        element.style.backgroundColor = mapGui.LEVELS_BG_ACTIVE;
        element.style.color = mapGui.LEVELS_ACTIVE_COLOR
      }
    }
  };
  lvlListClckEventHandler = function (g) {
    return function () {
      ui.lvlLstEventHandler(g)
    }
  };
  for (cnt = currentDrawing.l.length - 1; cnt >= 0; cnt--) {
    floor = document.createElement("div");
    floor.setAttribute("id", "ui-levels-floor-" + currentDrawing.l[cnt].id);
    floor.setAttribute("level", currentDrawing.l[cnt].id);
    floor.className = "ui_levels_floor ui_levels_unselected";
    floor.style.height = floorHeight + "px";
    floor.style.top = floorHeightManager + "px";
    floor.style.backgroundColor = this.LEVELS_BG;
    floorHeightManager += floorHeight;
    floor.style.width = lvlWrpWidth + "px";
    if (cnt != currentDrawing.l.length - 1) {
      floor.style.borderTop = "1px solid #f2f2f2"
    }
    floor.onclick = lvlListClckEventHandler(currentDrawing.l[cnt].id);
    floor.onmouseover = function (g) {
      if (mapGui.hasClass(this, "ui_levels_unselected")) {
        this.style.backgroundColor = mapGui.LEVELS_HOVER_BG_COLOR;
        this.style.color = mapGui.LEVELS_HOVER_COLOR
      }
    };
    floor.onmouseout = function (g) {
      if (mapGui.hasClass(this, "ui_levels_unselected")) {
        this.style.backgroundColor = mapGui.LEVELS_BG;
        this.style.color = mapGui.LEVELS_COLOR
      }
    };
    floor.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 3;
    floorName = document.createElement("div");
    floorName.setAttribute("id", "ui-levels-floor-" + currentDrawing.l[cnt].id);
    floorName.setAttribute("level", currentDrawing.l[cnt].id);
    floorName.className = "ui_levels_floor_name";
    floorName.style.fontSize = lvlWrpWidth * 0.6 + "px";
    nameShortened = currentDrawing.l[cnt].nm.substring(0, 2);
    floorName.innerHTML = nameShortened;
    if (nameShortened.length == 1) {
      floorName.style.left = lvlWrpWidth * 0.3 + "px"
    }
    if (nameShortened.length == 2) {
      floorName.style.left = lvlWrpWidth * 0.15 + "px"
    }
    floorName.style.top = floorHeight * 0.25 + "px";
    floorName.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 1;
    floor.appendChild(floorName);
    ui.levelsFlrs.appendChild(floor)
  }
  ui.levels.style.height = lvlFlrH + "px";
  ui.levelsCtr.style.height = lvlFlrH + "px";
  ui.levelsFlrs.style.height = floorHeightManager + "px";
  ui.levelsWrp.style.height = lvlFlrH + "px";
  ui.levelsFlrs.onMouseWheel = function (g) {
    g.preventDefault();
    g.cancelBubble = true;
    if (g.stopPropogation) {
      g.stopPropogation()
    }
    ui = mapGui.ui;
    if (g.detail) {
      g.wheelDelta = -g.detail / 3
    }
    btnMove = (floorHeight / floorHeightManager) * 100;
    if (g.wheelDelta < 0) {
      newLvlScale = ui.levelsFlrs.offsetTop - btnMove
    } else {
      newLvlScale = ui.levelsFlrs.offsetTop + btnMove
    }
    ui.levelsFlrs.style.left = 0;
    ui.levelsFlrs.style.top = newLvlScale + "px";
    mapGui.UILevelsContain();
    mapGui.UILevelArrowToggle();
    mapGui.conditionalUI()
  };
  viewportElement = this.viewportElement;
  this.ui.levels.ontouchstart = function (g) {
    g.preventDefault();
    startLvlPos = g.touches[0].pageY;
    startLvlScroll = true;
    totalMoved = 0
  };
  this.ui.levels.ontouchmove = function (g) {
    if (g.touches.length == 1) {
      g.preventDefault();
      var h = g.touches[0];
      ui.levelsFlrs.style.left = 0;
      if (startLvlScroll == true) {
        fingerMoved = startLvlPos - h.pageY;
        totalMoved += fingerMoved;
        startLvlPos = h.pageY;
        ui.levelsFlrs.style.top = ui.levelsFlrs.offsetTop - fingerMoved + "px";
        mapGui.UILevelsContain()
      }
      mapGui.UILevelArrowToggle();
      mapGui.conditionalUI()
    }
  };
  this.ui.levels.ontouchend = function (h) {
    if ((startLvlScroll) && (Math.abs(totalMoved) <= tMaps.MapGUI.MOVE_LIMIT)) {
      var g = h.target.getAttribute("level");
      if (g) {
        ui.lvlLstEventHandler(g)
      }
    }
    startLvlScroll = false
  };
  this.UILevelsArrow()
};
tMaps.MapGUI.prototype.UILevelsArrow = function () {
  mapGui = this;
  ui = this.ui;
  this.ui.lvlArwUp = document.createElement("div");
  this.ui.lvlArwUp.setAttribute("id", "ui-levels-arrow-up");
  this.ui.lvlArwUp.style.width = arwWdth + "px";
  this.ui.lvlArwUp.style.top = "0px";
  if (this.LEVELS_POSITION == "left top") {
    this.ui.lvlArwUp.style.left = lvlWidth * 1.1 + "px"
  } else {
    this.ui.lvlArwUp.style.left = "0px"
  }
  this.ui.lvlArwUp.style.height = "40px";
  this.ui.lvlArwUp.style.display = "none";
  this.ui.lvlArwUp.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 6;
  this.ui.levels.appendChild(this.ui.lvlArwUp);
  this.ui.lvlArwUpImg = document.createElement("img");
  this.ui.lvlArwUpImg.src = tMaps.settings.SCRIPT_URL + "resources/arrowUp.png";
  this.ui.lvlArwUpImg.style.width = "60%";
  this.ui.lvlArwUpImg.style.position = "absolute";
  this.ui.lvlArwUpImg.style.top = "0px";
  this.ui.lvlArwUpImg.style.left = "5px";
  this.ui.lvlArwUp.appendChild(this.ui.lvlArwUpImg);
  this.ui.lvlArwUp.onclick = function (a) {
    newScale = ui.levelsFlrs.offsetTop + floorHeight / 2;
    ui.levelsFlrs.style.left = 0;
    ui.levelsFlrs.style.top = newScale + "px";
    mapGui.UILevelsContain();
    mapGui.UILevelArrowToggle()
  };
  this.ui.lvlArwDn = document.createElement("div");
  this.ui.lvlArwDn.setAttribute("id", "ui-levels-arrow-down");
  this.ui.lvlArwDn.style.width = arwWdth + "px";
  this.ui.lvlArwDn.style.top = lvlFlrH - 20 + "px";
  if (this.LEVELS_POSITION == "left top") {
    this.ui.lvlArwDn.style.left = lvlWidth * 1.1 + "px"
  } else {
    this.ui.lvlArwDn.style.left = "0px"
  }
  this.ui.lvlArwDn.style.height = "40px";
  this.ui.lvlArwDn.style.display = "none";
  this.ui.lvlArwDn.style.zIndex = tMaps.MapGUI.CONTROL_ZINDEX + 6;
  this.ui.levels.appendChild(this.ui.lvlArwDn);
  this.ui.lvlArwDnImg = document.createElement("img");
  this.ui.lvlArwDnImg.src = tMaps.settings.SCRIPT_URL + "resources/arrowDwn.png";
  this.ui.lvlArwDnImg.style.width = "60%";
  this.ui.lvlArwDnImg.style.position = "absolute";
  this.ui.lvlArwDnImg.style.top = "0px";
  this.ui.lvlArwDnImg.style.left = "5px";
  this.ui.lvlArwDn.appendChild(this.ui.lvlArwDnImg);
  this.ui.lvlArwDn.onclick = function (a) {
    newScale = ui.levelsFlrs.offsetTop - floorHeight / 2;
    ui.levelsFlrs.style.left = 0;
    ui.levelsFlrs.style.top = newScale + "px";
    mapGui.UILevelsContain();
    mapGui.UILevelArrowToggle()
  };
  this.UILevelArrowToggle()
};
tMaps.MapGUI.prototype.UILevelArrowToggle = function () {
  mapGui = this;
  if (floorHeightManager > lvlFlrH && ((this.ui.levelsFlrs.offsetTop + floorHeightManager != this.ui.levelsWrp.offsetTop + this.ui.levelsWrp.offsetHeight))) {
    this.UILevelCondDwnIn = setTimeout(function (a) {
      mapGui.fadeIn("ui-levels-arrow-down");
      clearTimeout(mapGui.UILevelCondDwnIn)
    }, 750)
  } else {
    this.UILevelCondDwnOut = setTimeout(function (a) {
      mapGui.fadeOut("ui-levels-arrow-down");
      clearTimeout(mapGui.UILevelCondDwnOut)
    }, 750)
  }
  if (this.ui.levelsFlrs.offsetTop < 0) {
    this.UILevelCondUpIn = setTimeout(function (a) {
      mapGui.fadeIn("ui-levels-arrow-up");
      clearTimeout(mapGui.UILevelCondUpIn)
    }, 750)
  } else {
    this.UILevelCondUpOut = setTimeout(function (a) {
      mapGui.fadeOut("ui-levels-arrow-up");
      clearTimeout(mapGui.UILevelCondUpOut)
    }, 750)
  }
};
tMaps.MapGUI.prototype.determinePositionArraySetup = function (b, a, d, c) {
  if (this.UISections[a] == undefined) {
    this.UISections[a] = []
  }
  itemStore = [];
  itemStore.item = b;
  itemStore.weight = d;
  itemStore.margin = c;
  this.UISections[a].push(itemStore);
  this.UISections[a].sort(function (g, f) {
    return g.weight - f.weight
  })
};
tMaps.MapGUI.prototype.determinePosition = function () {
  var cientWidth = this.viewportElement.clientWidth;
  var clientHeight = this.viewportElement.clientHeight;
  var h = 0;
  var a;
  var d = 15;
  var g;
  this.heightMarker = [];
  this.positionExceptions();
  for (var i = 0; i < this.grid.length; i++) {
    tmpPos = this.grid[i];
    if (!this.heightMarker[tmpPos]) {
      this.heightMarker[tmpPos] = 10
    }
    if (!this.widthMarker[tmpPos]) {
      this.widthMarker[tmpPos] = 10
    }
  }
  for (position in this.UISections) {
    switch (position) {
      case "left top":
      case "center top":
      case "right top":
      case "left center":
      case "center center":
      case "right center":
        for (cnt = 0; cnt < this.UISections[position].length; cnt++) {
          h = 0;
          a = this.heightMarker[position];
          g = this.UISections[position][cnt].item;
          margin = this.UISections[position][cnt].margin;
          if (!margin) {
            margin = d
          }
          switch (position) {
            case "left top":
              this.ui[g].style.top = a + "px";
              this.ui[g].style.left = cientWidth * 0.025 + "px";
              break;
            case "left center":
              h = clientHeight / 2;
              h -= h * 0.1;
              this.ui[g].style.top = a + h + "px";
              this.ui[g].style.left = cientWidth * 0.025 + "px";
              break;
            case "center top":
              this.ui[g].style.top = a + "px";
              this.ui[g].style.left = (cientWidth / 2) - this.ui[g].offsetWidth / 2 + "px";
              break;
            case "center center":
              h = clientHeight / 2;
              h -= h * 0.1;
              this.ui[g].style.top = (a + h) + "px";
              this.ui[g].style.left = (cientWidth / 2) - this.ui[g].offsetWidth / 2 + "px";
              break;
            case "right top":
              this.ui[g].style.top = a + "px";
              this.ui[g].style.left = cientWidth - this.ui[g].offsetWidth - cientWidth * 0.025 + "px";
              break;
            case "right center":
              h = clientHeight / 2;
              h -= h * 0.1;
              this.ui[g].style.top = (a + h) + "px";
              this.ui[g].style.left = cientWidth - this.ui[g].offsetWidth - cientWidth * 0.025 + "px";
              break
          }
          this.heightMarker[position] += this.ui[g].offsetHeight + margin;
          if (this.ui[g].offsetWidth > this.widthMarker[position]) {
            this.widthMarker[position] = this.ui[g].offsetWidth
          }
        }
        break;
      default:
        for (cnt = this.UISections[position].length - 1; cnt >= 0; cnt--) {
          h = 0;
          a = this.heightMarker[position];
          g = this.UISections[position][cnt].item;
          margin = this.UISections[position][cnt].margin;
          if (!margin) {
            margin = d
          }
          switch (position) {
            case "left bottom":
              this.ui[g].style.top = (clientHeight - (a + this.ui[g].offsetHeight)) + "px";
              this.ui[g].style.left = cientWidth * 0.025 + "px";
              break;
            case "center bottom":
              this.ui[g].style.top = (clientHeight - (a + this.ui[g].offsetHeight)) + "px";
              this.ui[g].style.left = (cientWidth / 2) - this.ui[g].offsetWidth / 2 + "px";
              break;
            case "right bottom":
              this.ui[g].style.top = (clientHeight - (a + this.ui[g].offsetHeight)) + "px";
              this.ui[g].style.left = cientWidth - this.ui[g].offsetWidth - cientWidth * 0.025 + "px";
              break
          }
          this.heightMarker[position] += this.ui[g].offsetHeight + margin;
          if (this.ui[g].offsetWidth > this.widthMarker[position]) {
            this.widthMarker[position] = this.ui[g].offsetWidth
          }
        }
        break
    }
  }
};
tMaps.MapGUI.prototype.positionExceptions = function () {
  var a;
  for (position in this.UISections) {
    for (cnt = 0; cnt < this.UISections[position].length; cnt++) {
      item = this.UISections[position][cnt].item;
      switch (item) {
        case "name":
          if (position != "left top" && position != "right top") {
            a = this.UISections[position][cnt];
            this.UISections[position].splice(cnt, 1);
            this.NAME_POSITION = this.gridDefaults.name;
            this.determinePositionArraySetup(a.item, this.gridDefaults.name, a.weight, a.margin)
          }
          break;
        case "zoom":
          if (position == "center center" || !this.inArray(this.grid, position)) {
            a = this.UISections[position][cnt];
            this.UISections[position].splice(cnt, 1);
            this.ZOOM_POSITION = this.gridDefaults.zoom;
            this.determinePositionArraySetup(a.item, this.gridDefaults.zoom, a.weight, a.margin)
          }
          break;
        case "levels":
          if (position != "left top" && position != "right top") {
            a = this.UISections[position][cnt];
            this.UISections[position].splice(cnt, 1);
            this.LEVELS_POSITION = this.gridDefaults.levels;
            this.determinePositionArraySetup(a.item, this.gridDefaults.levels, a.weight, a.margin)
          }
          break;
        case "geo":
          if (position != "right bottom" && position != "right top") {
            a = this.UISections[position][cnt];
            this.UISections[position].splice(cnt, 1);
            this.GEO_POSITION = this.gridDefaults.geo;
            this.determinePositionArraySetup(a.item, this.gridDefaults.geo, a.weight, a.margin)
          }
          break
      }
    }
  }
};
tMaps.MapGUI.prototype.removeElement = function (a) {
  tobeRemoved = document.getElementById(a);
  if (tobeRemoved) {
    tobeRemoved.onmouseover = null;
    tobeRemoved.onclick = null;
    this.ui.removeChild(tobeRemoved)
  }
};
tMaps.MapGUI.prototype.fadeOut = function (b) {
  if (typeof this.fadeItems.out == "undefined") {
    this.fadeItems.out = []
  }
  var f = document.getElementById(b);
  if (!f) {
    return
  }
  if (f.style.display == "none") {
    return
  }
  var d = "out";
  var c = this;
  var a = this.fadeInterval.length;
  if (!this.fadeItems.out[b]) {
    this.fadeItems.out[b] = true;
    this.fadeInterval[a] = setInterval(function () {
      c.UIFade(f, d, a, b)
    }, 20)
  }
};
tMaps.MapGUI.prototype.fadeIn = function (b) {
  if (typeof this.fadeItems["in"] == "undefined") {
    this.fadeItems["in"] = []
  }
  var f = document.getElementById(b);
  if (!f) {
    return
  }
  if (f.style.display != "none") {
    return
  }
  var d = "in";
  var c = this;
  f.style.opacity = 0;
  f.style.filter = "alpha(opacity=0)";
  f.style.display = "block";
  var a = this.fadeInterval.length;
  if (!this.fadeItems["in"][b]) {
    this.fadeItems["in"][b] = true;
    this.fadeInterval[a] = setInterval(function () {
      c.UIFade(f, d, a, b)
    }, 20)
  }
};
tMaps.MapGUI.prototype.UIFade = function (d, c, a, b) {
  if (typeof this.UIFade.fadeSet == "undefined") {
    this.UIFade.fadeSet = [];
    this.UIFade.fadeReal = []
  }
  if (typeof this.UIFade.fadeSet[a] == "undefined") {
    this.UIFade.fadeSet[a] = 0;
    this.UIFade.fadeReal[a] = 1
  }
  this.UIFade.fadeSet[a] += 0.1;
  if (c == "in") {
    this.UIFade.fadeReal[a] = this.UIFade.fadeSet[a]
  }
  if (c == "out") {
    this.UIFade.fadeReal[a] = this.UIFade.fadeReal[a] - 0.1
  }
  d.style.opacity = this.UIFade.fadeReal[a];
  d.style.filter = "alpha(opacity=" + this.UIFade.fadeReal[a] * 100 + ")";
  if (this.UIFade.fadeSet[a] >= 1) {
    if (c == "in") {
      d.style.display = "block"
    }
    if (c == "out") {
      d.style.display = "none"
    }
    clearInterval(this.fadeInterval[a]);
    delete this.fadeInterval[a];
    delete this.fadeItems[c][b];
    delete this.UIFade.fadeSet[a];
    delete this.UIFade.fadeReal[a]
  }
};
tMaps.MapGUI.prototype.availSpace = function (c, a) {
  var b = [];
  b.avail = 0;
  b.taken = 0;
  switch (true) {
    case (c == "right top" && a == "h"):
      b.avail = this.heightMarker["right top"] - (this.heightMarker["right center"] + this.heightMarker["right bottom"]);
      b.taken = this.heightMarker["right center"] + this.heightMarker["right bottom"];
      break;
    case (c == "left top" && a == "h"):
      b.avail = this.heightMarker["left top"] - (this.heightMarker["left center"] + this.heightMarker["left bottom"]);
      b.taken = this.heightMarker["left center"] + this.heightMarker["left bottom"];
      break;
    case (c == "right top" && a == "w"):
      b.avail = this.widthMarker["right top"] - (this.widthMarker["center top"] + this.widthMarker["left top"]);
      b.taken = this.widthMarker["center top"] + this.widthMarker["left top"];
      break;
    case (c == "left top" && a == "w"):
      b.avail = this.widthMarker["left top"] - (this.widthMarker["center top"] + this.widthMarker["right top"]);
      b.taken = this.widthMarker["center top"] + this.widthMarker["right top"];
      break
  }
  if (b.avail == undefined) {
    b.avail = 0
  }
  if (b.taken == undefined) {
    b.taken = 0
  }
  return b
};
tMaps.MapGUI.prototype.addClass = function (b, a) {
  if (!this.hasClass(b, a)) {
    b.className += " " + a
  }
};
tMaps.MapGUI.prototype.hasClass = function (b, a) {
  return b.className && new RegExp("(^|\\s)" + a + "(\\s|$)").test(b.className)
};
tMaps.MapGUI.prototype.removeClass = function (c, a) {
  if (this.hasClass(c, a)) {
    var b = new RegExp("(\\s|^)" + a + "(\\s|$)");
    c.className = c.className.replace(b, " ")
  }
};
tMaps.MapGUI.prototype.inArray = function (a, b) {
  for (i = 0; i < a.length; i++) {
    if (b == a[i]) {
      return true
    }
  }
  return false
};
tMaps.MapGUI.prototype.hexCheck = function (a) {
  if (a.charAt(0) != "#") {
    return "#" + a
  }
  return a
};
tMaps.MapGUI.prototype.error = function (b) {
  var a = this;
  this.ui.error = document.createElement("div");
  this.ui.error.setAttribute("id", "ui-error");
  this.ui.errorClose = document.createElement("div");
  this.ui.errorClose.setAttribute("id", "ui-error-close");
  this.ui.errorClose.innerHTML = "x";
  this.ui.error.appendChild(this.ui.errorClose);
  this.ui.errorCloseMsg = document.createElement("div");
  this.ui.errorCloseMsg.setAttribute("id", "ui-error-mesg");
  this.ui.errorCloseMsg.innerHTML = b;
  this.ui.error.appendChild(this.ui.errorCloseMsg);
  this.ui.errorClose.onclick = function (c) {
    a.fadeOut("ui-error")
  };
  this.ui.error.style.display = "none";
  this.viewportElement.appendChild(this.ui.error)
};
tMaps.MapGUI.prototype.UIReg = function (name, value) {
  this.ui.reg[name] = value
};
tMaps.MapGUI.prototype.conditionalUI = function () {
  var a;
  var b = this;
  if (this.conditionalAction) {
    clearTimeout(this.conditionalAction);
    for (a in this.ui.reg) {
      xChk = document.getElementById(a);
      if (!xChk) {
        continue
      }
      if (this.ui.reg[a] == "conditional" && xChk.style.display == "none") {
        this.fadeIn(a)
      }
    }
  }
  this.conditionalAction = setTimeout(function (c) {
    for (a in b.ui.reg) {
      if (b.ui.reg[a] == "conditional" || b.ui.reg[a] == "conditional_hidden") {
        b.fadeOut(a)
      }
    }
    clearTimeout(b.conditionalAction)
  }, 4000)
};