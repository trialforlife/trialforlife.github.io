tMaps.MapData = function (mapControl, view, mapCanvas, mapGUI) {
  this.mapControl = mapControl;
  this.view = view;
  this.mapCanvas = mapCanvas;
  this.mapGUI = mapGUI;
  this.community = null;
  this.currentDrawing = null;
  this.ti = null;
  this.currentLevel = null;
  this.geomMap = null;
  this.levelMap = null;
  this.drawingMap = null;
  this.groupMap = null;
  this.event = {};
  this.unloadedMOverlays = [];
  this.unloadedGOverlays = [];
  this.unloadedInlays = [];
  this.nextId = tMaps.MapData.INITIAL_ID
};
tMaps.MapData.DEFAULT_ZINDEX = 1;
tMaps.MapData.INITIAL_ID = -1;
tMaps.MapData.DEFAULT_THEME_NAME = "General";
tMaps.MapData.prototype.mxyToLatLon = function (d, b) {
  if (!this.ti) {
    return null;
  }
  var a = d * this.ti.mxToLat + b * this.ti.myToLat + this.ti.lat0;
  var c = d * this.ti.mxToLon + b * this.ti.myToLon + this.ti.lon0;
  return [a, c]
};
tMaps.MapData.prototype.latLonToMxy = function (b, d) {
  if (!this.ti) {
    return null;
  }
  b -= this.ti.lat0;
  d -= this.ti.lon0;
  var c = b * this.ti.latToMx + d * this.ti.lonToMx;
  var a = b * this.ti.latToMy + d * this.ti.lonToMy;
  return [c, a]
};
tMaps.MapData.prototype.getCommunity = function () {
  return this.community
};
tMaps.MapData.prototype.getCurrentDrawing = function () {
  return this.currentDrawing
};
tMaps.MapData.prototype.getCurrentLevel = function () {
  return this.currentLevel
};
tMaps.MapData.prototype.loadCommunity = function () {
  var mapData = this;
  mapData.setCommunity();
};
tMaps.MapData.prototype.setDrawing = function (currentDrawing, currentLevel) {
  if (!currentDrawing) {
    return
  }
  this.currentDrawing = currentDrawing;
  this.transformInfo = null;
  var mapData = this;
  var communityLayers = this.currentDrawing.l;

  this.initTransform();

  var currentLevel = false;
  var zIndex = -999999;
  if (communityLayers) {
    var i;
    var l = communityLayers.length;
    for (i = 0; i < l; i++) {
      var communityLayer = communityLayers[i];
      if (currentLevel) {
        if (communityLayer.id == currentLevel) {
          currentLevel = communityLayer;
          break
        }
      } else {
        if (communityLayer.z < 0) {
          if (communityLayer.z > zIndex) {
            currentLevel = communityLayer;
            zIndex = communityLayer.z
          }
        } else {
          if ((communityLayer.z < zIndex) || (zIndex < 0)) {
            currentLevel = communityLayer;
            zIndex = communityLayer.z
          }
        }
      }
    }
  }
  if (!currentLevel) {
    alert("Display level not found")
  }
  this.event.drawChange = 1;
  this.view.updateDrawing(this.currentDrawing);
  this.mapGUI.updateDrawing(this.currentDrawing);
  this.setLevel(currentLevel);
};
tMaps.MapData.prototype.setLevel = function (b) {
  var a = this.currentLevel;
  this.currentLevel = b;
  this.mapGUI.updateLevel(this.currentLevel, a);
  this.mapCanvas.updatelevel(this.currentLevel, a);
  if (this.mapChanged) {
    this.mapChanged(this.event);
    this.event.drawChange = 0;
    this.event.comLoad = 0;
    this.event.drawLoad = 0
  }
};
tMaps.MapData.prototype.getGeometryLevel = function (a) {
  var b = this.geomMap[a];
  if (b) {
    return b.pl
  } else {
    return null;
  }
};
tMaps.MapData.prototype.addMarkerOverlay = function (marker, isNotGroupList) {
  if (!this.community) {
    return
  }
  if (!marker.aid) {
    marker.aid = this.createId()
  }
  if (marker.lid) {
    var currentLevel = null;
    var currentLevelObj = this.levelMap[marker.lid];
    if (currentLevelObj) {
      currentLevel = currentLevelObj.l;
      this.addMarkerToLevel(marker, currentLevel)
    } else {
      if (!marker.x) {
        marker.x = 1;
        this.unloadedMOverlays.push(marker)
      }
    }
  } else {
    if (marker.id) {
      var groupList = null;
      if (!isNotGroupList) {
        groupList = this.getGeometryGroupList(marker.id)
      }
      if (groupList != null) {
        var i;
        var c;
        var f;
        for (i = 0; i < groupList.length; i++) {
          c = groupList[i];
          if (c.id != marker.id) {
            f = this.getCopy(marker);
            f.id = c.id
          } else {
            f = marker
          }
          this.addMarkerToGeom(f)
        }
      } else {
        this.addMarkerToGeom(marker)
      }
    } else {
      alert("Level info missing");
      return
    }
  }
};
tMaps.MapData.prototype.removeMarkerOverlay = function (c, o) {
  if (!this.community) {
    return
  }
  var k;
  var a;
  var markers;
  var marker;
  var j;
  var d = this.community.d.length;
  for (var i = 0; i < d; i++) {
    k = this.community.d[i];
    if (k.l) {
      for (var m = 0; m < k.l.length; m++) {
        markers = k.l[m].m;
        if (markers) {
          for (var i = 0; i < markers.length; i++) {
            marker = markers[i];
            j = o ? marker.anm : marker.aid;
            if (j == c) {
              markers.splice(i, 1);
              i--;
              this.mapCanvas.removeMarker(marker)
            }
          }
        }
      }
    }
  }
  var g = 0;
  while (g < this.unloadedMOverlays.length) {
    marker = this.unloadedMOverlays[g];
    j = o ? marker.anm : marker.aid;
    if (j == c) {
      this.unloadedMOverlays.splice(g, 1);
      delete marker.x
    } else {
      g++
    }
  }
};
tMaps.MapData.prototype.addGeometryOverlay = function (overlay) {
  if (!this.community) {
    return
  }
  if (!overlay.lid) {
    alert("missing overlay level");
    return
  }
  if ((!overlay.zi) || ((overlay.zi >= 0) && (overlay.zi < 1))) {
    overlay.zi = tMaps.MapData.DEFAULT_ZINDEX
  }
  if (!overlay.id) {
    overlay.aid = this.createId();
    overlay.id = overlay.aid
  } else {
    if (overlay.id > tMaps.MapData.INITIAL_ID) {
      alert("Invalid overlay id");
      return
    }
    if (overlay.id != overlay.aid) {
      alert("Format error on geometry overlay.");
      return
    }
    var b = this.geomMap[overlay.id];
    if (b) {
      this.removeGeometryOverlay(b.aid)
    }
  }
  var c = this.levelMap[overlay.lid];
  if (c) {
    var d = c.l;
    if (overlay.x) {
      delete overlay.x
    }
    this.addToObjectMap(overlay, d);
    d.gList.add(overlay);
    this.mapCanvas.invalidateGeom(overlay, overlay.lid, overlay.zi)
  } else {
    if (!overlay.x) {
      overlay.x = 1;
      this.unloadedGOverlays.push(overlay)
    }
  }
};
tMaps.MapData.prototype.removeGeometryOverlay = function (d, p) {
  if (!this.community) {
    return
  }
  var m;
  var b;
  var o;
  var j;
  var f = p ? "anm" : "aid";
  var h;
  var c = this.community.d.length;
  for (h = 0; h < c; h++) {
    m = this.community.d[h];
    if (m.l) {
      var n;
      var a = m.l.length;
      for (n = 0; n < a; n++) {
        b = m.l[n];
        o = b.gList;
        do {
          j = o.remove(d, f);
          if (j) {
            this.removeFromObjectMap(j);
            this.mapCanvas.invalidateGeom(j, j.lid, j.zi)
          }
        } while (j)
      }
    }
  }
  var k;
  var g;
  h = 0;
  while (h < this.unloadedGOverlays.length) {
    g = this.unloadedGOverlays[h];
    k = p ? g.anm : g.aid;
    if (k == d) {
      this.unloadedGOverlays.splice(h, 1);
      delete g.x
    } else {
      h++
    }
  }
};
tMaps.MapData.prototype.addInlay = function (f, g) {
  if (!this.community) {
    return
  }
  if (!f.id) {
    alert("missing inlay id");
    return
  }
  if (!f.aid) {
    f.aid = this.createId()
  }
  if (!f.zi) {
    f.zi = tMaps.MapData.DEFAULT_ZINDEX
  }
  var b = null;
  if (!g) {
    b = this.getGeometryGroupList(f.id)
  }
  if (b != null) {
    var d;
    var c;
    var a;
    for (d = 0; d < b.length; d++) {
      c = b[d];
      if (c.id != f.id) {
        a = this.getCopy(f);
        a.id = c.id
      } else {
        a = f
      }
      this.addIndividualInlay(a)
    }
  } else {
    this.addIndividualInlay(f)
  }
};
tMaps.MapData.prototype.removeInlay = function (d, t) {
  if (!this.community) {
    return
  }
  var v;
  var a;
  var c;
  var o;
  var s;
  var b;
  var n = this.community.d.length;
  var m;
  var f;
  for (var k = 0; k < n; k++) {
    v = this.community.d[k];
    if (v.l) {
      s = v.l.length;
      for (var h = 0; h < s; h++) {
        a = v.l[h];
        m = a.gList;
        for (m.start();
             ((c = m.currentList()) != null); m.next()) {
          f = m.currentZi();
          b = c.length;
          for (var j = 0; j < b; j++) {
            o = c[j];
            var q = o;
            var r = null;
            while (q) {
              q = this.getRemoveReplaceGeom(q, d, t);
              if (q) {
                r = q
              }
            }
            if (r) {
              c[j] = r;
              this.mapCanvas.invalidateGeom(o, a.id, f);
              this.mapCanvas.invalidateGeom(r, a.id, f)
            }
          }
        }
      }
    }
  }
  var p = 0;
  var u;
  var g;
  while (p < this.unloadedInlays.length) {
    g = this.unloadedInlays[p];
    u = t ? g.anm : g.aid;
    if (u == d) {
      this.unloadedInlays.splice(p, 1);
      delete g.x
    } else {
      p++
    }
  }
};
tMaps.MapData.prototype.removeAnnotation = function (a) {
  this.removeInlay(a, true);
  this.removeGeometryOverlay(a, true);
  this.removeMarkerOverlay(a, true)
};
tMaps.MapData.prototype.setCommunity = function () {
  this.community = tMaps.getMapData();
  if (this.community == null) {
    alert("null community!");
    return
  }
  this.initCommunity();
  var mapLevels = this.community.d;
  if (mapLevels == null) {
    alert("no drawings!");
    return
  }
  var currentDrawing;
  var i;
  var l;
  if (tMaps.MapLevelId) {
    l = mapLevels.length;
    for (i = 0; i < l; i++) {
      if (mapLevels[i].id == tMaps.MapLevelId) {
        currentDrawing = mapLevels[i];
      }
    }
  } else {
    currentDrawing = mapLevels[0];
  }
  if (!currentDrawing) {
    l = mapLevels.length;
    for (i = 0; i < l; i++) {
      if (mapLevels[i].r) {
        currentDrawing = mapLevels[i]
      }
    }
  }
  if (!currentDrawing) {
    alert("no root drawing found");
    this.currentDrawing = null;
    return
  }
  this.event.comLoad = 1;
  this.setDrawing(currentDrawing);
};
tMaps.MapData.prototype.updateDrawing = function (a, f) {
  if ((!this.community) || (!this.community.d) || (!a)) {
    return
  }
  var g = this.community.d;
  var h;
  var c;
  var b = g.length;
  for (c = 0; c < b; c++) {
    h = g[c];
    if (h.id == a.id) {
      g[c] = a;
      break
    }
  }
  this.event.drawLoad = 1;
  this.initDrawing(a);
  this.checkGeometryOverlays();
  this.checkMarkerOverlays();
  this.checkInlays();
  this.setDrawing(a, f)
};
tMaps.MapData.prototype.checkGeometryOverlays = function () {
  var a;
  var b = 0;
  while (b < this.unloadedGOverlays.length) {
    a = this.unloadedGOverlays[b];
    this.addGeometryOverlay(a);
    if (!a.x) {
      this.unloadedGOverlays.splice(b, 1)
    } else {
      b++
    }
  }
};
tMaps.MapData.prototype.checkInlays = function () {
  var b;
  var a = 0;
  while (a < this.unloadedInlays.length) {
    b = this.unloadedInlays[a];
    this.addInlay(b);
    if (!b.x) {
      this.unloadedInlays.splice(a, 1)
    } else {
      a++
    }
  }
};
tMaps.MapData.prototype.checkMarkerOverlays = function () {
  var a;
  var b = 0;
  while (b < this.unloadedMOverlays.length) {
    a = this.unloadedMOverlays[b];
    this.addMarkerOverlay(a);
    if (!a.x) {
      this.unloadedMOverlays.splice(b, 1)
    } else {
      b++
    }
  }
};
tMaps.MapData.prototype.addMarkerToGeom = function (a) {
  var c = this.geomMap[a.id];
  if (c) {
    var b = c.g;
    if (b.l) {
      a.mx = b.l[0];
      a.my = b.l[1]
    } else {
      return
    }
    var d = c.pl;
    if (d) {
      a.lid = d.id;
      this.addMarkerToLevel(a, d)
    }
  } else {
    if (!a.x) {
      a.x = 1;
      this.unloadedMOverlays.push(a)
    }
  }
};
tMaps.MapData.prototype.addMarkerToLevel = function (a, b) {
  if (a.x) {
    delete a.x
  }
  if (!b.m) {
    b.m = [a]
  } else {
    b.m.push(a)
  }
  this.mapCanvas.addMarker(a)
};
tMaps.MapData.prototype.addIndividualInlay = function (h) {
  var a = this.getGeometryLevel(h.id);
  if (a) {
    if (h.x) {
      delete h.x
    }
    var f;
    var c;
    var b;
    var g;
    var j = a.gList;
    var k;
    for (j.start();
         ((f = j.currentList()) != null); j.next()) {
      k = j.currentZi();
      b = f.length;
      for (g = 0; g < b; g++) {
        c = f[g];
        if (c.id == h.id) {
          var d = this.getAddReplaceGeom(c, h);
          if (d) {
            f[g] = d;
            this.mapCanvas.invalidateGeom(c, a.id, k);
            this.mapCanvas.invalidateGeom(d, a.id, k)
          }
          break
        }
      }
    }
  } else {
    if (!h.x) {
      h.x = 1;
      this.unloadedInlays.push(h)
    }
  }
};
tMaps.MapData.prototype.getAddReplaceGeom = function (c, f) {
  if ((c.base) && (c.base.i.zi >= f.zi)) {
    var a = this.getAddReplaceGeom(c.base.g, f);
    if (a) {
      var b = c.base.i;
      var d = this.applyInlay(a, b);
      return d
    } else {
      return null;
    }
  } else {
    return this.applyInlay(c, f)
  }
};
tMaps.MapData.prototype.applyInlay = function (c, d) {
  var a = this.getCopy(c);
  var b;
  for (b in d) {
    a[b] = d[b]
  }
  a.base = {
    g: c,
    i: d
  };
  return a
};
tMaps.MapData.prototype.getCopy = function (c) {
  var a = {};
  var b;
  for (b in c) {
    a[b] = c[b]
  }
  return a
};
tMaps.MapData.prototype.getRemoveReplaceGeom = function (c, g, b) {
  if (c.base) {
    var f = b ? c.base.i.anm : c.base.i.aid;
    if (f == g) {
      var d = c.base.i;
      d.proc = false;
      return c.base.g
    } else {
      var a = this.getRemoveReplaceGeom(c.base.g, g, b);
      if (a) {
        var h = this.applyInlay(a, c.base.i);
        return h
      }
    }
  }
  return null;
};
tMaps.MapData.prototype.initCommunity = function () {
  this.currentLevel = null;
  this.currentDrawing = null;
  this.geomMap = {};
  this.levelMap = {};
  this.drawingMap = {};
  this.groupMap = {};
  this.unloadedMOverlays = [];
  this.unloadedGOverlays = [];
  this.unloadedInlays = [];
  var community;
  if ((this.community) && (this.community.d)) {
    var i;
    var l = this.community.d.length;
    for (i = 0; i < l; i++) {
      community = this.community.d[i];
      this.initDrawing(community);
    }
  }
};
tMaps.MapData.prototype.initDrawing = function (data) {
  var level;
  var item;
  var d;
  this.drawingMap[data.id] = data;
  if (data.l) {
    var i;
    var levelCount = data.l.length;
    for (i = 0; i < levelCount; i++) {
      level = data.l[i];
      if (level.id) {
        this.levelMap[level.id] = {
          l: level,
          d: data
        };
        if (level.g) {
          level.gList = new tMaps.ZList(level.g);
          var j;
          var itemCount = level.g.length;
          for (j = 0; j < itemCount; j++) {
            item = level.g[j];
            this.initShape(item);
            if (item.id) {
              d = this.geomMap[item.id];
              if (!d) {
                d = {
                  g: item
                };
                this.geomMap[item.id] = d
              }
              if (item.r) {
                d.ml = level
              } else {
                d.pl = level
              }
              if (item.gid) {
                d = this.groupMap[item.gid];
                if (d) {
                  d.push(item)
                } else {
                  d = [item];
                  this.groupMap[item.gid] = d
                }
              }
            }
          }
        }
      }
    }
  }
};
tMaps.MapData.prototype.initTransform = function () {
  var c = {};
  var b = this.currentDrawing.t;
  c.mxToLon = b[0];
  c.myToLon = b[2];
  c.mxToLat = b[1];
  c.myToLat = b[3];
  c.lon0 = b[4];
  c.lat0 = b[5];
  var a = c.mxToLon * c.myToLat - c.mxToLat * c.myToLon;
  c.lonToMx = c.myToLat / a;
  c.lonToMy = -c.mxToLat / a;
  c.latToMx = -c.myToLon / a;
  c.latToMy = c.mxToLon / a;
  this.ti = c
};
tMaps.MapData.prototype.initShape = function (a) {
  if (a.st == null) {
    if (a.shp) {
      a.st = 2
    } else {
      a.st = 0
    }
  }
  if (a.gt == null) {
    if (a.shp) {
      a.gt = 2
    } else {
      a.gt = 0
    }
  }
};
tMaps.MapData.prototype.addToObjectMap = function (b, c) {
  if (!b.id) {
    return
  }
  this.initShape(b);
  var a = this.geomMap[b.id];
  if (!a) {
    a = {
      g: b
    };
    this.geomMap[b.id] = a
  }
  a.pl = c;
  if (b.gid) {
    a = this.groupMap[b.gid];
    if (a) {
      a.push(b)
    } else {
      a = [b];
      this.groupMap[b.gid] = a
    }
  }
};
tMaps.MapData.prototype.removeFromObjectMap = function (a) {
  if (!a.id) {
    return
  }
  delete this.geomMap[a.id];
  if (a.gid) {
    delete this.groupMap[a.gid]
  }
};
tMaps.MapData.prototype.getGeometryGroupList = function (a) {
  var b = this.geomMap[a];
  var c = null;
  if (b) {
    c = b.g
  }
  if ((c) && (c.gid)) {
    return this.groupMap[c.gid]
  } else {
    return null;
  }
};
tMaps.MapData.prototype.createId = function () {
  return this.nextId--
};