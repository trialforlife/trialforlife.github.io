tMaps.ZList = function (a) {
  this.head = {
    next: null,
    prev: null,
    list: a,
    zi: 0
  };
  this.iter = null;
};
tMaps.ZList.prototype.add = function (c) {
  if (c.zi === 0) {
    alert("illegal zindex");
    return true;
  }
  var d = this.head;
  var b = null;
  while ((d) && (d.zi < c.zi)) {
    b = d;
    d = d.next;
  }
  if ((d) && (d.zi === c.zi)) {
    d.list.push(c);
  } else {
    var a = {
      next: d,
      prev: b,
      list: [c],
      zi: c[this.sortParam]
    };
    if (b !== null) {
      b.next = a;
    } else {
      this.head = a;
    }
    if (d !== null) {
      d.prev = a;
    }
  }
};
tMaps.ZList.prototype.remove = function (d, b) {
  var h = this.head;
  var f;
  var a;
  var c;
  while (h) {
    if (h.zi !== 0) {
      f = h.list;
      for (a = 0; a < f.length; a++) {
        c = f[a][b];
        if (d === c) {
          var g = f[a];
          f.splice(a, 1);
          return g;
        }
      }
    }
    h = h.next;
  }
  return null;
};
tMaps.ZList.prototype.start = function () {
  this.iter = this.head
};
tMaps.ZList.prototype.currentList = function () {
  if (this.iter) {
    return this.iter.list;
  } else {
    return null;
  }
};
tMaps.ZList.prototype.currentZi = function () {
  if (this.iter) {
    return this.iter.zi;
  } else {
    return null;
  }
};
tMaps.ZList.prototype.next = function () {
  if (this.iter) {
    this.iter = this.iter.next
  }
};