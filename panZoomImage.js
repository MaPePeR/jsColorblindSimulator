// Inspired by http://phrogz.net/tmp/canvas_zoom_to_cursor.html
panZoomImage = {canvas: document.getElementById('outCanvas'),
    lastX: 0, lastY: 0, translateX: 0, translateY: 0, scale: 1.0, dragged: false, lens: 0};
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

        var lensImage, fullImage;
        if (this.lens === 0) {
            fullImage = this.currentImage;
        } else if (this.lens === 1) {
            fullImage = this.currentImage;
            lensImage = currentImage;
        } else if (this.lens === 2) {
            fullImage = currentImage;
            lensImage = this.currentImage;
        }

        this.ctx.drawImage(fullImage,
            0, 0, this.currentImage.width, this.currentImage.height,
            this.translateX, this.translateY,
            this.currentImage.width * this.scale, this.currentImage.height * this.scale);
        if (this.lens ===  1 || this.lens === 2) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.lastX, this.lastY, 50, 0, 2 * Math.PI);
            this.ctx.clip();
            this.ctx.drawImage(lensImage,
                    (this.lastX - this.translateX - 50) / this.scale, (this.lastY - this.translateY - 50) / this.scale,
                    100 / this.scale, 100  / this.scale,
                    this.lastX - 50, this.lastY - 50,
                    100, 100);
            this.ctx.restore();
        }
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
    }
    panZoomImage.lastX = thisX;
    panZoomImage.lastY = thisY;
    panZoomImage.redraw();
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
        panZoomImage.zoom(evt.shiftKey ? -1 : 1);
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
