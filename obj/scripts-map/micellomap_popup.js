tMaps.MapPopup = function (c, b, a) {
  this.mapCanvas = c;
  this.view = a;
  this.isActive = false;
  this.isVisible = false;
  this.containerX = 0;
  this.containerX = 0;
  this.data = null;
  this.parentElement = b;
  this.mainDiv = null
};
tMaps.MapPopup.MAX_FRACTION = 0.6;
tMaps.MapPopup.MAX_WIDTH = 300;
tMaps.MapPopup.MAX_HEIGHT = 300;
tMaps.MapPopup.INFO_CLOSE_MARGIN = 5;
tMaps.MapPopup.MENU_CLOSE_MARGIN = 5;
tMaps.MapPopup.prototype.setData = function (a) {
  this.data = a;
  if (this.mainDiv != null) {
    this.parentElement.removeChild(this.mainDiv);
    this.mainDiv = null
  }
  if (a.type == tMaps.popuptype.MENU) {
    this.createMenuPopup(a)
  } else {
    if (a.type == tMaps.popuptype.INFOWINDOW) {
      this.createInfoPopup(a)
    }
  }
};
tMaps.MapPopup.prototype.exeCmd = function (a) {
  a.func()
};
tMaps.MapPopup.prototype.update = function () {
  var a = this.mapCanvas.data.getCurrentLevel();
  if ((!a) || (!this.isActive)) {
    this.setVisible(false);
    return
  }
  if (this.data) {
    if (a.id != this.data.lid) {
      this.setVisible(false)
    } else {
      var coordX = this.view.mapToCanvasX(this.data.mapX, this.data.mapY);
      var coordY = this.view.mapToCanvasY(this.data.mapX, this.data.mapY);
      if (this.data.ox) {
        coordX -= this.data.ox
      }
      if (this.data.oy) {
        coordY -= this.data.oy
      }
      var clientHeight = this.parentElement.clientHeight;
      var clientWidth = this.parentElement.clientWidth;
      this.setVisible(true);
      if ((this.containerX != coordX) || (this.containerY != coordY)) {

        var posY = this.view.mapToViewportY(this.data.mapX, this.data.mapY) - this.mainDiv.offsetHeight;
        posY = clientHeight - coordY + (posY >= 0 ? 0 : posY - 20);

        var posX = this.view.getViewportWidth() - this.view.mapToViewportX(this.data.mapX, this.data.mapY) - this.mainDiv.offsetWidth
        posX = posX > 0 ? coordX + 20 : coordX - this.mainDiv.offsetWidth - 20;

        this.mainDiv.style.bottom =  String(posY) + "px";
        this.mainDiv.style.left = String(posX) + "px";
        this.containerX = coordX;
        this.containerY = coordY;
      }
    }
  }
};
tMaps.MapPopup.prototype.setActive = function (a) {
  this.isActive = a;
  this.update();
};
tMaps.MapPopup.prototype.setVisible = function (a) {
  if (this.isVisible != a) {
    if (a) {
      this.isVisible = true
      this.mainDiv.style.display = "block";
    } else {
      this.mainDiv.style.display = "none";
      this.isVisible = false
    }
  }
};
tMaps.MapPopup.prototype.createMenuPopup = function (object) {
  var a = this;
  a.mainDiv = document.createElement("div");
  a.mainDiv.className = "menu";
  a.mainDiv.style.position = "absolute";
  a.mainDiv.style.zIndex = tMaps.MapGUI.POPUP_ZINDEX;
  a.mainDiv.style.bottom = "0px";
  a.mainDiv.style.left = "0px";
  a.containerX = 0;
  a.containerY = 0;
  a.menuWrapperDiv = document.createElement("div");
  a.menuWrapperDiv.className = "menuWrapper";
  a.mainDiv.appendChild(this.menuWrapperDiv);
  var m = document.createElement("ul");
  m.className = "menuTable";
  if (object.title) {
    var n = document.createElement("li");
    n.className = "menuTitle";
    n.innerHTML = object.title;
    m.appendChild(n);
  }
  if (object.desc) {
    var n = document.createElement("li");
    n.className = "menuDesc";
    n.innerHTML = object.desc;
    m.appendChild(n);
  }
  if (object.commands) {
    var commandLenght = object.commands.length;
    for (var i = 0; i < commandLenght; i++) {
      var elLi = document.createElement("li");
      var currentCommand = object.commands[i];
      var elCommand = document.createElement("a");
      var elCommandCounter = document.createElement("span");

      elLi.className = "menuItem";
      elCommand.className = "button success";
      elCommand.href = "";
      elCommand.innerHTML = currentCommand.name;
      elCommand.cmd = currentCommand;
      elCommand.counter = elCommandCounter.innerHTML = 0;
      elCommand.onclick = function () {
//        a.setActive(false);
        this.cmd.func();
        this.firstChild.innerHTML = ++this.counter;
        return false;
      };
//      elCommand.ontouchstart = elCommand.onclick;
      elCommand.insertBefore(elCommandCounter,elCommand.firstChild);
      elLi.appendChild(elCommand);
      m.appendChild(elLi);
    }
  }

  /* Close button */
  var k = document.createElement("li");
  k.className = "menuItem";
  var j = document.createElement("a");
  j.className = "button warning";
  j.href = "";
  j.innerHTML = "Close popup".i18n();
  j.onclick = function () {
    setTimeout(function(){
      a.setActive(false);
    }, 100);
    return false;
  };
  //j.ontouchstart = j.onclick;
  k.appendChild(j);
  m.appendChild(k);

  a.menuWrapperDiv.appendChild(m);
  a.mainDiv.style.display = "none";
  a.isVisible = false;
  a.parentElement.appendChild(this.mainDiv)
};
tMaps.MapPopup.prototype.createInfoPopup = function (c) {
  this.mainDiv = document.createElement("div");
  this.mainDiv.className = "menu";
  this.mainDiv.setAttribute("id", "infoDiv");
  this.mainDiv.style.position = "absolute";
  this.mainDiv.style.zIndex = tMaps.MapGUI.POPUP_ZINDEX;
  this.mainDiv.style.bottom = "0px";
  this.mainDiv.style.left = "0px";
  this.parentElement.appendChild(this.mainDiv)
};

