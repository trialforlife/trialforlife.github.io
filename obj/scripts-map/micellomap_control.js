tMaps.MapControl = function () {
  if (!tMaps.mapName) {
    alert("You must have a map name.");
    return;
  }
  this.createControl();
  this.selectInlay = {
    id: 0,
    zi: tMaps.MapControl.SELECT_ZINDEX,
    t: "Selected",
    anm: "slct"
  };
  this.popup = this.mapCanvas.createPopup();
  var map = this;
  this.mapCanvas.onMapClick = function (posX, posY, obj) {
    map.onMapClick(posX, posY, obj)
  };
  this.doSelectAction = this.defaultSelectAction;
  this.showInfo = this.showDefaultInfoWindow;
  this.selected = null;
  this.highlighted = false;
  this.routeTo = null;
  this.routeFrom = null;
  this.routeActive = false;
  this.routeOverlay = null;
  this.popupFlags = tMaps.MapControl.SHOW_ALL
};
tMaps.MapControl.SELECT_ZINDEX = 9999;
tMaps.MapControl.SHOW_INFO = 1;
tMaps.MapControl.SHOW_INSIDE = 2;
tMaps.MapControl.SHOW_NAV = 4;
tMaps.MapControl.SHOW_ALL = 15;
tMaps.MapControl.MAX_URL_LENGTH = 25;
tMaps.MapControl.prototype.getMapData = function () {
  return this.data;
};
tMaps.MapControl.prototype.getMapView = function () {
  return this.view
};
tMaps.MapControl.prototype.getMapCanvas = function () {
  return this.mapCanvas
};
tMaps.MapControl.prototype.getMapGUI = function () {
  return this.mapGUI
};

tMaps.MapControl.prototype.centerMap = function (posX, posY) {
  var mapOffsetX = (this.view.getViewportWidth() / 2) - this.view.mapToViewportX(posX, posY);
  var mapOffsetY = (this.view.getViewportHeight() / 2) - this.view.mapToViewportY(posX, posY);

  var mapElement = this.mapGUI.mapElement;
  mapElement.transitionOn(.5);
  this.view.translate(mapOffsetX, mapOffsetY);
  setTimeout(function () {
    mapElement.transitionOff();
  }, 500);
};
tMaps.MapControl.prototype.redrawRouteMarkers = function () {
  var routes = tMaps.tracker.getTrackerRoutes(5);
  var markers = tMaps.tracker.getTrackerMarkers(2);

  if(!routes || !markers){
    return;
  }

  var thisLevel = mapDataObject.getCurrentLevel(); // get current level object

  var traceRoute = {
    g: [],
    m: []
  };

  angular.forEach(markers, function (marker, key) {
    var point = {
      "lid": thisLevel.id,
      "mr": "TrackingDot",
      "mt": tMaps.markertype.NAMED,
      "mx": marker.x,
      "my": marker.y,
      "idat": "Step",
      "anm": tMaps.routeLayerName,
    };
    if (key === 0) {
      point.mr = "RouteStart";
      point.idat = "Start";
    }
    if (key === markers.length - 1) {
      point.mr = "RouteEnd";
      point.idat = "Last Point";
    }
    traceRoute.m.push(point);
  });

  angular.forEach(routes, function (point, key) {
    var id = key > 4 ? 4 : key;
    if (typeof traceRoute.g[id] === "undefined") {
      traceRoute.g[id] = {
        "lid": thisLevel.id,
        "t": "Route" + (id + 1), // theme name
        "shp": [],
        "gt": 1
      }
      if (id > 0) {
        traceRoute.g[id - 1].shp.push([ traceRoute.g[id - 1].shp.length == 0 ? 0 : 1, point.x, point.y]);
      }
    }
    traceRoute.g[id].shp.push([ traceRoute.g[id].shp.length == 0 ? 0 : 1, point.x, point.y]);
  });
  this.data.removeAnnotation(tMaps.routeLayerName);
  this.showAnnotation(traceRoute, tMaps.routeLayerName);
  this.centerMap(markers[markers.length-1].x, markers[markers.length-1].y);
};
tMaps.MapControl.prototype.addRouteMarker = function (posX, posY) {
  if (posX < 0 || posY < 0 || posX > mapDataObject.currentDrawing.w || posY > mapDataObject.currentDrawing.h) {
    return;
  }
  tMaps.tracker.addTrackerLog(posX, posY);
  this.redrawRouteMarkers();
};

tMaps.MapControl.prototype.showPopupMenu = function (obj, posX, posY) {
  var popupData = {};
  popupData.type = tMaps.popuptype.MENU;
  popupData.title = obj.nm;
  if(obj.desc) {
    popupData.desc = obj.desc;
  }
  popupData.commands = [];
  this.loadActivitiesCommands(obj, popupData.commands);

  var c = false;
  if ((obj.gt) || (obj.lt)) {
    level = this.data.getGeometryLevel(obj.id);
    popupData.lid = level.id;
    popupData.ox = 0;
    popupData.oy = 10;
    popupData.mapX = posX;
    popupData.mapY = posY;
    c = true;
  } else {
    if (obj.mt) {
      c = this.loadMarkerLocationInfo(obj, popupData);
    }
  }
  if (c) {
    this.popup.setData(popupData);
    this.popup.setActive(true);
    return true;
  } else {
    this.popup.setActive(false);
    return false;
  }
};
tMaps.MapControl.prototype.showInfoWindow = function (d, a) {
  var b = {};
  b.type = tMaps.popuptype.INFOWINDOW;
  b.html = a;
  var c = false;
  if ((d.gt) || (d.lt)) {
    c = this.loadGeomLocationInfo(d, b)
  } else {
    if (d.mt) {
      c = this.loadMarkerLocationInfo(d, b)
    }
  }
  if (c) {
    this.popup.setData(b);
    this.popup.setActive(true);
    return true
  } else {
    this.popup.setActive(false);
    return false
  }
};
tMaps.MapControl.prototype.hideInfoWindow = function () {
  this.popup.setActive(false)
};
tMaps.MapControl.prototype.defaultSelectAction = function (posX, posY, obj) {
  if (!obj) {
    this.popup.setActive(false);
    this.addRouteMarker(posX, posY);
  } else {
    if (obj.idat) {
      // click on marker
      this.showInfoWindow(obj, obj.idat);
    } else {
      if (obj.p) {
        // click on shelve
        this.showPopupMenu(obj, posX, posY);
      } else {
        // click on empty space
        this.popup.setActive(false);
        this.addRouteMarker(posX, posY);
      }
    }
  }
};
tMaps.MapControl.prototype.showDefaultInfoWindow = function (b) {
  var a = this.data.getCommunity();
  if (!a) {
    return
  }
  if ((b) && (b.id) && (b.id > 0) && (b.l)) {
    var d = this;
    var c = function (f, g) {
      d.processInfo(f, g)
    };
    tMaps.request.loadInfo(b, c, a.cid)
  }
  this.popup.setActive(false)
};
tMaps.MapControl.prototype.loadGeomLocationInfo = function (obj, popupData) {
  var c = this.data.getGeometryLevel(obj.id);
  if (!c) {
    return false
  }
  popupData.lid = c.id;
  popupData.ox = 0;
  popupData.oy = 10;
  if (!obj.l) {
    return false
  }
  popupData.mapX = obj.l[0];
  popupData.mapY = obj.l[1];
  return true
};
tMaps.MapControl.prototype.loadMarkerLocationInfo = function (a, b) {
  b.mapX = a.mx;
  b.mapY = a.my;
  b.ox = 0;
  b.oy = a.oy;
  b.lid = a.lid;
  if ((isFinite(b.mapX)) && (isFinite(b.mapY)) || (b.lid)) {
    return true
  } else {
    return false
  }
};
tMaps.MapControl.prototype.processInfo = function (d, b) {
  var g = null;
  if (d.nm) {
    g = d.nm
  } else {
    if ((d.lt == 1) && (d.lr)) {
      g = d.lr
    }
  }
  var m;
  var j;
  var f = 0;
  var k = document.createElement("table");
  k.className = "infoTable";
  if (g) {
    m = k.insertRow(f++);
    j = m.insertCell(0);
    j.className = "infoTitle";
    j.colSpan = "2";
    j.innerHTML = g
  }
  if (b.results) {
    var c;
    var h;
    var a = null;
    for (c = 0; c < b.results.length; c++) {
      h = b.results[c];
      a = h.type;
      if (a == null) {
        a = tMaps.infoentrytype.GENERAL
      }
      m = k.insertRow(f++);
      j = m.insertCell(0);
      j.className = "infoItemNm";
      j.innerHTML = h.name;
      j = m.insertCell(1);
      j.className = "infoItemVal";
      j.innerHTML = h.value;
    }
  }
  this.showInfoWindow(d, k);
};
/* Generate menu action list */
tMaps.MapControl.prototype.loadActivitiesCommands = function (clickedObj, menulist) {
  if (clickedObj.id) {
    var mapControl = this;
    var action = {};
    for (i = 0; i < tMaps.mapActivities.length; i++) {
      action = tMaps.mapActivities[i];
      var d = {
        name: action.name,
        id: action.id,
        shelf: clickedObj.id,
        func: function () {
          tMaps.tracker.addActivityLog(this.id, this.shelf);
        }
      };
      menulist.push(d);
    }
  }
};
tMaps.MapControl.prototype.onMapClick = function (posX, posY, obj) {
  if ((obj != null) && ((obj.pdat) || (obj.idat) || (obj.p))) {
    if (obj != this.selected) {
      this.selectObject(obj);
    }
  } else {
    if (this.selected != null) {
      this.deselectObject();
    }
  }
  if (this.doSelectAction) {
    this.doSelectAction(posX, posY, obj);
  }
};
tMaps.MapControl.prototype.selectObject = function (object) {
  if (this.highlighted) {
    this.data.removeInlay("slct", true)
  }
  if ((object.id) && (object.gt == tMaps.geomtype.AREA)) {
    this.selectInlay.id = object.id;
    this.data.addInlay(this.selectInlay);
    this.highlighted = true;
  } else {
    this.highlighted = false;
  }
  this.selected = object;
};
tMaps.MapControl.prototype.deselectObject = function () {
  if (this.highlighted) {
    this.data.removeInlay("slct", true)
  }
  this.selected = null;
  this.highlighted = false
};
tMaps.MapControl.prototype.showAnnotation = function (traceRoute, name) {
  var vectorLines = traceRoute.g;
  var a = traceRoute.i;
  var markers = traceRoute.m;
  var overay;
  var i;
  if (vectorLines) {
    for (i = 0; i < vectorLines.length; i++) {
      overay = vectorLines[i];
      if (name) {
        overay.anm = name
      }
      this.data.addGeometryOverlay(overay)
    }
  }
  if (a) {
    for (i = 0; i < a.length; i++) {
      overay = a[i];
      if (name) {
        overay.anm = name
      }
      this.data.addGeometryOverlay(overay)
    }
  }
  if (markers) {
    for (i = 0; i < markers.length; i++) {
      overay = markers[i];
      if (name) {
        overay.anm = name
      }
      this.data.addMarkerOverlay(overay)
    }
  }
};
tMaps.MapControl.prototype.createControl = function () {
  this.mapGUI = new tMaps.MapGUI(this);
  var viewportElement = this.mapGUI.viewportElement;
  var mapElement = this.mapGUI.mapElement;
  this.mapCanvas = new tMaps.MapCanvas(this, mapElement);
  this.view = new tMaps.MapView(this, viewportElement, mapElement, this.mapCanvas, this.mapGUI);
  this.data = new tMaps.MapData(this, this.view, this.mapCanvas, this.mapGUI);
  this.mapGUI.mapCanvas = this.mapCanvas;
  this.mapGUI.data = this.data;
  this.mapGUI.view = this.view;
  this.mapCanvas.data = this.data;
  this.mapCanvas.view = this.view
}