// Source: http://web.archive.org/web/20081014161121/http://www.colorjack.com/labs/colormatrix/
// Another Source: https://www.reddit.com/r/gamedev/comments/2i9edg/code_to_create_filters_for_colorblind/
//
/* Comment on http://kaioa.com/node/75#comment-247 states that:

ColorMatrix? Nope, won't work.
You're right, the ColorMatrix version is very simplified, and not accurate. I created that color matrix one night (http://www.colorjack.com/labs/colormatrix/)
and since then it's shown up many places... I should probably take that page down before it spreads more! Anyways, it gives you an idea of what it might look
like, but for the real thing...

As far as a simple script to simulate color blindness, this one does the best job:

http://www.nofunc.com/Color_Blindness_Library/ — It uses "confusion lines" within the XYZ color space to calculate values (this one is in Javascript, and should be easy to convert to python).

There are a few other methods, and no one really knows exactly what it would look like... these are all generalizations of a small sample, set against the masses.
*/
var ColorMatrixMatrixes = {
    Normal:       {
        R:[100,      0,     0],
        G:  [0,    100,      0],
        B:  [0,      0, 100/*Fixed: was in the wrong spot in the original version*/]},
    Protanopia:   {
        R:[56.667, 43.333,  0],
        G:[55.833, 44.167,  0],
        B: [0,     24.167, 75.833]},
    Protanomaly:  {
        R:[81.667, 18.333,  0],
        G:[33.333, 66.667,  0],
        B: [0,     12.5,   87.5]},
    Deuteranopia: {
        R:[62.5, 37.5,  0],
        G:[70,   30,    0],
        B: [0,   30,   70]},
    Deuteranomaly:{
        R:[80,     20,      0],
        G:[25.833, 74.167,  0],
        B: [0,     14.167, 85.833]},
    Tritanopia:   {
        R:[95,  5,      0],
        G: [0, 43.333, 56.667],
        B: [0, 47.5,   52.5]},
    Tritanomaly:  {
        R:[96.667, 3.333,   0],
        G: [0,     73.333, 26.667],
        B: [0,     18.333, 81.667]},
    Achromatopsia:{
        R:[29.9, 58.7, 11.4],
        G:[29.9, 58.7, 11.4],
        B:[29.9, 58.7, 11.4]},
    Achromatomaly:{
        R:[61.8, 32,    6.2],
        G:[16.3, 77.5,  6.2],
        B:[16.3, 32.0, 51.6]}
};

function matrixFunction(matrix) {
    return function (rgb) {
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        return [
            r * matrix.R[0] / 100.0 + g * matrix.R[1] / 100.0 + b * matrix.R[2] / 100.0,
            r * matrix.G[0] / 100.0 + g * matrix.G[1] / 100.0 + b * matrix.G[2] / 100.0,
            r * matrix.B[0] / 100.0 + g * matrix.B[1] / 100.0 + b * matrix.B[2] / 100.0
        ];
    };
}

var colorMatrixFilterFunctions = {};
for (var t in ColorMatrixMatrixes) {
    if (ColorMatrixMatrixes.hasOwnProperty(t)) {
        colorMatrixFilterFunctions[t] = matrixFunction(ColorMatrixMatrixes[t]);
    }
}

var imageCache = {};
var urlCache = {};
function clearImageCache() {
    imageCache = {};
    urlCache = {};
}

function getFilteredImage(img, type, callback) {
    console.log('getFilteredImage');
    if (type in imageCache) {
        callback(imageCache[type], urlCache[type]);
    } else {
        if (type === 'hcirnNormal' || type === 'simplNormal') {
            imageCache[type] = img;
            urlCache[type] = '#';
            callback(img, '#');
        } else {
            var filtered = createFilteredImage(img, type, function (filtered, url) {
                imageCache[type] = filtered;
                urlCache[type] = url;
                callback(filtered, url);
            });
        }
    }
}

function createFilteredImage(img, type, callback) {
    console.log('createFilteredImage');
    var filterFunction = getFilterFunction(type);
    var canvas = document.createElement('canvas');
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var pixels = ctx.getImageData(0, 0, w, h);

    // Split the work into 5 chunks
    var chunkSize = Math.max(pixels.data.length / 5, 1);
    var i = 0;
    // Chain of setTimeout-calls, so the progressbar can render.
    setTimeout(function doWork() {
        var chunkEnd = Math.min(i + chunkSize, pixels.data.length);
        for (; i < chunkEnd; i += 4) {
            var rgb = [pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]];
            filteredRGB = filterFunction(rgb);
            pixels.data[i    ] = filteredRGB[0];
            pixels.data[i + 1] = filteredRGB[1];
            pixels.data[i + 2] = filteredRGB[2];
        }
        // 20% is loading the image
        NProgress.set(0.2 + 0.8 * (i / pixels.data.length));
        if (i < pixels.data.length) {
            setTimeout(doWork, 0); // Self reference
        } else {
            // Work is done
            ctx.putImageData(pixels, 0, 0);
            var url = canvas.toDataURL();
            console.log(url);
            var filteredImage = new Image();
            filteredImage.onload = function () {
                callback(this, url);
            };
            filteredImage.src = url;
        }
    }, 0);

}

function getFilterFunction(type) {
    var lib;
    if (type.substring(0, 5) === 'hcirn') {
        lib = fBlind;
    } else if (type.substring(0, 5) === 'simpl') {
        lib = colorMatrixFilterFunctions;
    } else {
        throw 'Invalid Filter Type!';
    }
    type = type.substring(5);
    if (type in lib) {
        return lib[type];
    } else {
        throw 'Library does not support Filter Type: ' + type;
    }
}
