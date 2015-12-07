tMaps.MapTheme = function (a) {
  this.themeNames = a;
  this.themes = new Array(a.length);
  this.loaded = false
};
tMaps.MapTheme.prototype.placeTheme = function (objThemes) {
  var b = this.themeNames.length;
  var d = true;
  for (var a = 0; a < b; a++) {
    if (objThemes.mt == this.themeNames[a]) {
      this.themes[a] = objThemes;
    }
    if (!this.themes[a]) {
      d = false;
    }
  }
  if (d) {
    this.loaded = true;
  }
};
tMaps.MapTheme.prototype.getStyle = function (b) {
  var d = this.themeNames.length;
  var f;
  var a;
  for (var c = 0; c < d; c++) {
    f = this.themes[c];
    if ((f) && (f.s)) {
      a = f.s[b];
      if (a) {
        return a
      }
    }
  }
  return null;
};
tMaps.MapTheme.prototype.getIcon = function (b) {
  var d = this.themeNames.length;
  var f;
  var a;
  for (var c = 0; c < d; c++) {
    f = this.themes[c];
    if ((f) && (f.ic)) {
      a = f.ic[b];
      if (a) {
        return a
      }
    }
  }
  return null;
};
tMaps.MapTheme.prototype.getMarker = function (b) {
  var d = this.themeNames.length;
  var f;
  var a;
  for (var c = 0; c < d; c++) {
    f = this.themes[c];
    if ((f) && (f.m)) {
      a = f.m[b];
      if (a) {
        return a
      }
    }
  }
  return null;
};

