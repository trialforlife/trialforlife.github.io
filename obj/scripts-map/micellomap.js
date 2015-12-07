var mapControl, mapDataObject;

tMaps = {};

tMaps.settings = {
  "HOST_URL": "http://localhost:9000",
  "SCRIPT_URL": "images/webmap/"
};

tMaps.tracker = false;

tMaps.shapetype = {};
tMaps.shapetype.NONE = 0;
tMaps.shapetype.PATH = 2;
tMaps.geomtype = {};
tMaps.geomtype.NONE = 0;
tMaps.geomtype.LINE = 1;
tMaps.geomtype.AREA = 2;
tMaps.geomtype.LINEAR_AREA = 3;
tMaps.path = {};
tMaps.path.MOVE_TO = 0;
tMaps.path.LINE_TO = 1;
tMaps.path.QUAD_TO = 2;
tMaps.path.CUBE_TO = 3;
tMaps.path.CLOSE = 4;
tMaps.labeltype = {};
tMaps.labeltype.NONE = 0;
tMaps.labeltype.TEXT = 1;
tMaps.labeltype.ICON = 2;
tMaps.labeltype.IMAGE = 3;
tMaps.labeltype.GEOM = 4;
tMaps.markertype = {};
tMaps.markertype.NONE = 0;
tMaps.markertype.NAMED = 1;
tMaps.markertype.IMAGE = 2;
tMaps.popuptype = {};
tMaps.popuptype.MENU = 1;
tMaps.popuptype.INFOWINDOW = 2;
tMaps.infoentrytype = {};
tMaps.infoentrytype.PHONE = 1;
tMaps.infoentrytype.EMAIL = 2;
tMaps.infoentrytype.URL = 3;
tMaps.infoentrytype.ADDRESS = 4;
tMaps.infoentrytype.GENERAL = 5;

tMaps.routeLayerName = "route";

tMaps.load = function () {
  mapControl = new this.MapControl();
  mapDataObject = mapControl.getMapData();
  mapDataObject.loadCommunity();
  return this;
};
tMaps.unload = function(){
    mapControl = null;
    mapDataObject = null;
    console.warn('unload');
};
tMaps.setMapData = function (data) {
  this.mapData = data;
  return this;
};
tMaps.getMapData = function () {
  function clone(o) {
    if(!o || "object" !== typeof o)  {
      return o;
    }
    var c = "function" === typeof o.pop ? [] : {};
    var p, v;
    for(p in o) {
      if(o.hasOwnProperty(p)) {
        v = o[p];
        if(v && "object" === typeof v) {
          c[p] = clone(v);
        }
        else c[p] = v;
      }
    }
    return c;
  }
  return clone(this.mapData);
};
tMaps.setMapActivities = function (activities) {
  this.mapActivities = activities;
  return this;
};
tMaps.setMapLevelId = function (id) {
  this.MapLevelId = id;
  return this;
};
tMaps.setMapTheme = function (theme) {
  this.mapThemeData = theme;
  return this;
};
tMaps.setMapName = function (id) {
  this.mapName = id;
  return this;
};
tMaps.setTracker = function (tracker) {
  this.tracker = tracker;
  return this;
};
tMaps.redrawRouteMarkers = function(){
  mapControl.popup.setActive(false);
  mapControl.redrawRouteMarkers();
};

tMaps.geom = {};
tMaps.geom.getCoordinates = function(coords){
  var _coords = [];
  var l = coords.length;
  for (i = 0; i < l-1; i++) {
    _coords.push({
      x: coords[i][1],
      y: coords[i][2]
    });
  }
  return _coords;
};
tMaps.geom.getPerimeterByCoords = function (coords) {
  return 0;
};
tMaps.geom.getSquareByCoords = function (coords) {
  return 0;
};
tMaps.geom.linearRoots = function (d, c, f) {
  if (d == 0) {
    return 0
  } else {
    f[0] = -c / d;
    return 1
  }
};
tMaps.geom.quadraticRoots = function (f, d, k, g) {
  if (f == 0) {
    return tMaps.geom.linearRoots(d, k, g)
  }
  var j = d * d - 4 * f * k;
  if (j < 0) {
    return 0
  } else {
    var h = -d / (2 * f);
    j = Math.sqrt(j) / (2 * f);
    g[0] = h + j;
    g[1] = h - j;
    return 2
  }
};
tMaps.geom.cubicRoots = function (o, m, j, f, g) {
  if (o != 0) {
    m = m / o;
    j = j / o;
    f = f / o;
    o = 1
  } else {
    return tMaps.geom.quadraticRoots(m, j, f, g)
  }
  var p = m / (3 * o);
  var n = 1 / (3 * o);
  var k = 2 * m * m * m - 9 * o * m * j + 27 * o * o * f;
  var q = m * m - 3 * o * j;
  var h = k * k - 4 * q * q * q;
  if (h > 0) {
    return tMaps.geom.caseOne(p, n, k, h, g)
  } else {
    if (h == 0) {
      return tMaps.geom.caseTwo(p, n, k, g)
    } else {
      return tMaps.geom.caseThree(p, n, k, h, g)
    }
  }
};
tMaps.geom.caseOne = function (j, h, g, f, d) {
  var c = Math.sqrt(f);
  var b = tMaps.geom.cubeRoot(0.5 * (g + c));
  var a = tMaps.geom.cubeRoot(0.5 * (g - c));
  d[0] = -j - h * b - h * a;
  return 1
};
tMaps.geom.caseTwo = function (f, d, c, b) {
  var a = tMaps.geom.cubeRoot(0.5 * c);
  b[0] = -f - 2 * d * a;
  b[2] = b[1] = -f + d * a;
  return 3
};
tMaps.geom.caseThree = function (o, n, m, k, j) {
  var a = Math.sqrt(-k);
  var b = Math.atan2(a, m);
  var d = 0.5 * Math.sqrt(m * m - k);
  var h = b / 3;
  var g = h + 2 * Math.PI / 3;
  var f = h - 2 * Math.PI / 3;
  var c = tMaps.geom.cubeRoot(d);
  j[0] = -o - 2 * n * c * Math.cos(h);
  j[1] = -o - 2 * n * c * Math.cos(g);
  j[2] = -o - 2 * n * c * Math.cos(f);
  return 3
};
tMaps.geom.cubeRoot = function (a) {
  if (a == 0) {
    return 0
  } else {
    if (a > 0) {
      return Math.exp(Math.log(a) / 3)
    } else {
      return -Math.exp(Math.log(-a) / 3)
    }
  }
};
tMaps.geom.intersectLine = function (b, f, a, d, g, j) {
  if (b == a) {
    return 0
  } else {
    var h = (g - b) / (a - b);
    if ((h >= 0) && (h < 1)) {
      var c = (d - f) * h + f;
      if (c > j) {
        return 1
      } else {
        return 0
      }
    } else {
      return 0
    }
  }
};
tMaps.geom.intersectQuad = function (f, o, c, n, a, m, b, k) {
  var j = new Array(2);
  var q = 0;
  var h = tMaps.geom.quadraticRoots((a - 2 * c + f), (c - f), (f - b), j);
  for (var g = 0; g < h; g++) {
    var d = j[g];
    if ((d >= 0) && (d < 1)) {
      var p = (m - 2 * n + o) * d * d + 2 * (n - o) * d + o;
      if (p > k) {
        q++
      }
    }
  }
  return q
};
tMaps.geom.intersectCube = function (g, q, d, p, c, o, a, m, b, n) {
  var k = new Array(3);
  var s = 0;
  var j = tMaps.geom.cubicRoots((a - 3 * c + 3 * d - g), 3 * (c - 2 * d + g), 3 * (d - g), (g - b), k);
  for (var h = 0; h < j; h++) {
    var f = k[h];
    if ((f >= 0) && (f < 1)) {
      var r = (m - 3 * o + 3 * p - q) * f * f * f + 3 * (o - 2 * p + q) * f * f + 3 * (p - q) * f + q;
      if (r > n) {
        s++
      }
    }
  }
  return s
};
tMaps.geom.cubeMinMax = function (g, d, b, a, o, h) {
  var m = new Array(5);
  var k = tMaps.geom.quadraticRoots(3 * (a - 3 * b + 3 * d - g), 6 * (b - 2 * d + g), 3 * (d - g), m);
  m[k++] = 0;
  m[k++] = 1;
  var n = o ? 0 : 1;
  for (var j = 0; j < k; j++) {
    var f = m[j];
    if ((f >= 0) && (f <= 1)) {
      var c = (a - 3 * b + 3 * d - g) * f * f * f + 3 * (b - 2 * d + g) * f * f + 3 * (d - g) * f + g;
      if (c < h[0][n]) {
        h[0][n] = c
      }
      if (c > h[1][n]) {
        h[1][n] = c
      }
    }
  }
};
tMaps.geom.quadMinMax = function (f, c, a, n, g) {
  var k = new Array(4);
  var j = tMaps.geom.linearRoots(2 * (a - 2 * c + f), 2 * (c - f), k);
  k[j++] = 0;
  k[j++] = 1;
  var m = n ? 0 : 1;
  for (var h = 0; h < j; h++) {
    var d = k[h];
    if ((d >= 0) && (d <= 1)) {
      var b = (a - 2 * c + f) * d * d + 2 * (c - f) * d + f;
      if (b < g[0][m]) {
        g[0][m] = b
      }
      if (b > g[1][m]) {
        g[1][m] = b
      }
    }
  }
};
tMaps.geom.lineMinMax = function (b, a, d, c) {
  var f = d ? 0 : 1;
  if (b < c[0][f]) {
    c[0][f] = b
  }
  if (b > c[1][f]) {
    c[1][f] = b
  }
  if (a < c[0][f]) {
    c[0][f] = a
  }
  if (a > c[1][f]) {
    c[1][f] = a
  }
};
tMaps.geom.pathHit = function (n, h, g) {
  var k;
  var b = n.length;
  var a = 0;
  var m = 0;
  var j = 0;
  var d = null;
  var c = null;
  for (var f = 0; f < b; f++) {
    k = n[f];
    switch (k[0]) {
      case 0:
        m = k[1];
        j = k[2];
        if ((d) && (c)) {
          if ((m != d) || (j != c)) {
            a += tMaps.geom.intersectLine(m, j, d, c, h, g)
          }
        }
        d = m;
        c = j;
        break;
      case 1:
        a += tMaps.geom.intersectLine(m, j, k[1], k[2], h, g);
        m = k[1];
        j = k[2];
        break;
      case 2:
        a += tMaps.geom.intersectQuad(m, j, k[1], k[2], k[3], k[4], h, g);
        m = k[3];
        j = k[4];
        break;
      case 3:
        a += tMaps.geom.intersectCube(m, j, k[1], k[2], k[3], k[4], k[5], k[6], h, g);
        m = k[5];
        j = k[6];
        break;
      case 4:
        if ((d) && (c)) {
          if ((m != d) || (j != c)) {
            a += tMaps.geom.intersectLine(m, j, d, c, h, g)
          }
        }
        break
    }
  }
  return ((a & 1) != 0)
};
tMaps.geom.getInvalidMinMax = function () {
  return [
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
  ]
};
tMaps.geom.loadPathMinMax = function (g, f) {
  var b;
  var a = g.length;
  var d = 0;
  var c = 0;
  for (var h = 0; h < a; h++) {
    b = g[h];
    switch (b[0]) {
      case 0:
        d = b[1];
        c = b[2];
        if (!f) {
          f = [
            [d, c],
            [d, c]
          ]
        }
        break;
      case 1:
        tMaps.geom.lineMinMax(d, b[1], true, f);
        tMaps.geom.lineMinMax(c, b[2], false, f);
        d = b[1];
        c = b[2];
        break;
      case 2:
        tMaps.geom.quadMinMax(d, b[1], b[3], true, f);
        tMaps.geom.quadMinMax(c, b[2], b[4], false, f);
        d = b[3];
        c = b[4];
        break;
      case 3:
        tMaps.geom.cubeMinMax(d, b[1], b[3], b[5], true, f);
        tMaps.geom.cubeMinMax(c, b[2], b[4], b[6], false, f);
        d = b[5];
        c = b[6];
        break
    }
  }
  return f
};
tMaps.geom.rotRectHit = function (b, h, f) {
  var j = h - b[0];
  var g = f - b[1];
  var a = Math.cos(b[4]);
  var k = Math.sin(b[4]);
  var d = -k;
  var c = a;
  return ((Math.abs(j * a + g * k) <= b[2] / 2) && (Math.abs(j * d + g * c) <= b[3] / 2))
};
tMaps.geom.loadRotRectMinMax = function (h, g) {
  var m = Math.cos(h[4]);
  var n = Math.sin(h[4]);
  var k = (Math.abs(m * h[2]) + Math.abs(n * h[3])) / 2;
  var j = (Math.abs(n * h[2]) + Math.abs(m * h[3])) / 2;
  var f = h[0] - k;
  var d = h[1] - j;
  var b = h[0] + k;
  var a = h[1] + j;
  if (!g) {
    g = [
      [f, d],
      [b, a]
    ]
  } else {
    g[0][0] = Math.min(f, g[0][0]);
    g[0][1] = Math.min(d, g[0][1]);
    g[1][0] = Math.max(b, g[1][0]);
    g[1][1] = Math.max(a, g[1][1])
  }
  return g
};

tMaps.request = {};
tMaps.request.CLOSE_URL = tMaps.settings.SCRIPT_URL + "resources/close10.png";
tMaps.request.CALLOUT_URL = tMaps.settings.SCRIPT_URL + "resources/callout34.png";

// Load Info of some object — wrong. need to get data from Community JSON
tMaps.request.loadInfo = function (b, c) {
  if ((b) && (b.id)) {
    var callbackFunction = function (f) {
      c(b, f)
    };
    var url = tMaps.settings.HOST_URL + "/v3_java/list/entity/properties.js?geom_id=" + b.id;
    tMaps.request.doRequest(url, callbackFunction, errorHandler, "GET")
  }
};
tMaps.request.doRequest = function (url, onDownload, onFailure, httpMethod, body) {
  var xmlhttp;
  var doIe = false;
  if (window.XDomainRequest) {
    xmlhttp = new XDomainRequest();
    xmlhttp.timeout = 10000;
    doIe = true
  } else {
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest()
    } else {
      alert("This browser is not supported.");
      return
    }
  }
  if (!doIe) {
    xmlhttp.dataManager = this;
    xmlhttp.onreadystatechange = function () {
      var msg;
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var data = eval("(" + xmlhttp.responseText + ")");
        if (data.error) {
          msg = "Error in request: " + data.error;
          onFailure(msg)
        } else {
          onDownload(data)
        }
      } else {
        if (xmlhttp.readyState == 4 && xmlhttp.status >= 400) {
          msg = "Error in http request. Status: " + xmlhttp.status;
          onFailure(msg)
        }
      }
    }
  } else {
    xmlhttp.onload = function () {
      var data = eval("(" + xmlhttp.responseText + ")");
      if (data.error) {
        msg = "Error in request: " + data.error;
        onFailure(msg)
      } else {
        onDownload(data)
      }
    };
    xmlhttp.onerror = function () {
      msg = "Error in http request. Status: " + xmlhttp.status;
      onFailure(msg)
    }
  }
  xmlhttp.open(httpMethod, url, true);
  if (!doIe) {
    if (httpMethod == "POST") {
      xmlhttp.setRequestHeader("Content-Type", "text/plain")
    }
  }
  xmlhttp.send(body)
};

errorHandler = function (a) {
  if (this.mapGui) {
    this.mapGui.error(a)
  } else {
    e = document.createElement("div");
    e.innerHTML = "Micello Map: " + a;
    e.setAttribute("id", "micello-map-msg");
    e.style.top = 0;
    e.style.left = 0;
    e.style.padding = "7px";
    e.style.border = "1px solid #666";
    e.style.backgroundColor = "#fff";
    e.style.position = "absolute";
    document.body.appendChild(e);
    setTimeout(function (b) {
      eM = document.getElementById("micello-map-msg");
      eM.style.display = "none"
    }, 7000)
  }
};
