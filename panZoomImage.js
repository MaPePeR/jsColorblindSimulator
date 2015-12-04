// Inspired by http://phrogz.net/tmp/canvas_zoom_to_cursor.html
panZoomImage = {canvas: document.getElementById('outCanvas'),
    lastX: 0, lastY: 0, translateX: 0, translateY: 0, scale: 1.0, dragged: false};
panZoomImage.displayImage = function displayImage(img) {
    this.ctx = this.canvas.getContext('2d');
    this.currentImage = img;
    this.onresize();
    this.redraw();
};
panZoomImage.onresize = function () {
    // Fill whole window canvas: http://stackoverflow.com/a/10215724/2256700
    this.canvas.style.width  = '100%';
    this.canvas.style.height = '100%';
    // ...then set the internal size to match
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.redraw();
};
window.onresize = function () {
    panZoomImage.onresize();
};
window.onload = function () {
    panZoomImage.onresize();
};

panZoomImage.redraw = function redraw(argument) {
    if (this.currentImage) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.currentImage,
            0, 0, this.currentImage.width, this.currentImage.height,
            this.translateX, this.translateY,
            this.currentImage.width * this.scale, this.currentImage.height * this.scale);
    }
};
panZoomImage.canvas.addEventListener('mousedown', function (evt) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    panZoomImage.lastX = evt.offsetX || (evt.pageX - panZoomImage.canvas.offsetLeft);
    panZoomImage.lastY = evt.offsetY || (evt.pageY - panZoomImage.canvas.offsetTop);
    panZoomImage.dragStart = {x: panZoomImage.lastX, y: panZoomImage.lastY};
    panZoomImage.dragged = false;
}, false);
panZoomImage.canvas.addEventListener('mousemove', function (evt) {
    var thisX = evt.offsetX || (evt.pageX - panZoomImage.canvas.offsetLeft);
    var thisY = evt.offsetY || (evt.pageY - panZoomImage.canvas.offsetTop);
    panZoomImage.dragged = true;
    if (panZoomImage.dragStart) {
        panZoomImage.translateX += thisX - panZoomImage.lastX;
        panZoomImage.translateY += thisY - panZoomImage.lastY;
        panZoomImage.redraw();
    }
    panZoomImage.lastX = thisX;
    panZoomImage.lastY = thisY;
}, false);
panZoomImage.zoom = function (clicks) {
    var oldscale = this.scale;
    this.scale *= Math.pow(1.1, clicks);
    var scalechange = this.scale - oldscale;
    // TODO Fix this
    this.translateX += -(this.lastX * scalechange);
    this.translateY += -(this.lastY * scalechange);
    this.redraw();
};
panZoomImage.canvas.addEventListener('mouseup', function (evt) {
    panZoomImage.dragStart = null;
    if (!panZoomImage.dragged) {
        panZoomImage.zoom(evt.shiftKey ? 1 : -1);
    }
}, false);

var handleScroll = function (evt) {
    var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
    if (delta) {
        panZoomImage.zoom(delta);
    }
    return evt.preventDefault() && false;
};
panZoomImage.canvas.addEventListener('DOMMouseScroll', handleScroll, false);
panZoomImage.canvas.addEventListener('mousewheel', handleScroll, false);
