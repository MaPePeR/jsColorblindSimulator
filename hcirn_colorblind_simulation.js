// Code grabbed from http://web.archive.org/web/20090318054431/http://www.nofunc.com/Color_Blindness_Library
// Added 2 missing } to fix code.
// Used Lookup table for Math.pow(<>/255, gamma)
/*

This function allows you to see what colors look like to those who are color blind.

Use the fBlind[] in order to convert. For instance: fBlind['Tritanomaly'](RGB) would convert RGB[] into Tritanomaly.

*/
/*

    The Color Blind Simulation function is
    copyright (c) 2000-2001 by Matthew Wickline and the
    Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

    It is used with the permission of Matthew Wickline and HCIRN,
    and is freely available for non-commercial use. For commercial use, please
    contact the Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

*/

var rBlind = {
    protan: {cpu: 0.735, cpv:  0.265, am: 1.273463, ayi: -0.073894},
    deutan: {cpu: 1.14,  cpv: -0.14,  am: 0.968437, ayi:  0.003331},
    tritan: {cpu: 0.171, cpv: -0.003, am: 0.062921, ayi:  0.292119}};

var fBlind = {
    Normal: function (v) { return (v); },
    Protanopia: function (v) { return (blindMK(v, 'protan')); },
    Protanomaly: function (v) { return (anomylize(v, blindMK(v, 'protan'))); },
    Deuteranopia: function (v) { return (blindMK(v, 'deutan')); },
    Deuteranomaly: function (v) { return (anomylize(v, blindMK(v, 'deutan'))); },
    Tritanopia: function (v) { return (blindMK(v, 'tritan')); },
    Tritanomaly: function (v) { return (anomylize(v, blindMK(v, 'tritan'))); },
    Achromatopsia: function (v) { return (monochrome(v)); },
    Achromatomaly: function (v) { return (anomylize(v, monochrome(v))); }
};

powGammaLookup = Array(256);
(function () {
    var i;
    for (i = 0; i < 256; i++) {
        powGammaLookup[i] = Math.pow(i / 255, 2.2);
    }

})();

function blindMK(rgb,t) {
    var gamma = 2.2, wx = 0.312713, wy = 0.329016, wz = 0.358271;

    function Color() {
         this.rgb_from_xyz = xyz2rgb;
         this.xyz_from_rgb = rgb2xyz;
     }

    var b = rgb[2], g = rgb[1], r = rgb[0];

    c.r = powGammaLookup[r];
    c.g = powGammaLookup[g];
    c.b = powGammaLookup[b];
    c.xyz_from_rgb();

    var sum_xyz = c.x + c.y + c.z;
    c.u = 0; c.v = 0;

    if (sum_xyz != 0) {
        c.u = c.x / sum_xyz;
        c.v = c.y / sum_xyz;
    }

    var nx = wx * c.y / wy,
        nz = wz * c.y / wy,
        clm,
        s = new Color(),
        d = new Color();
    d.y = 0;

    if (c.u < rBlind[t].cpu) {
        clm = (rBlind[t].cpv - c.v) / (rBlind[t].cpu - c.u);
    } else {
        clm = (c.v - rBlind[t].cpv) / (c.u - rBlind[t].cpu);
    }

    var clyi = c.v - c.u * clm; d.u = (rBlind[t].ayi - clyi) / (clm - rBlind[t].am);
    d.v = (clm * d.u) + clyi;

    s.x = d.u * c.y / d.v; s.y = c.y;
    s.z = (1 - (d.u + d.v)) * c.y / d.v;
    s.rgb_from_xyz();

    d.x = nx - s.x;
    d.z = nz - s.z;
    d.rgb_from_xyz();

    var adjr = d.r ? ((s.r < 0 ? 0 : 1) - s.r) / d.r : 0,
        adjg = d.g ? ((s.g < 0 ? 0 : 1) - s.g) / d.g : 0,
        adjb = d.b ? ((s.b < 0 ? 0 : 1) - s.b) / d.b : 0;

    var adjust = Math.max(
        ((adjr > 1 || adjr < 0) ? 0 : adjr),
        ((adjg > 1 || adjg < 0) ? 0 : adjg),
        ((adjb > 1 || adjb < 0) ? 0 : adjb)
    );

    s.r = s.r + (adjust * d.r);
    s.g = s.g + (adjust * d.g);
    s.b = s.b + (adjust * d.b);

    function z(v) {
        return (255 * (v <= 0 ? 0 : v >= 1 ? 1 : Math.pow(v, 1 / gamma)));
    }

    return ([z(s.r),z(s.g),z(s.b)]);

}

function rgb2xyz() {

    this.x = (0.430574 * this.r + 0.341550 * this.g + 0.178325 * this.b);
    this.y = (0.222015 * this.r + 0.706655 * this.g + 0.071330 * this.b);
    this.z = (0.020183 * this.r + 0.129553 * this.g + 0.939180 * this.b);

    return this;

}

function xyz2rgb() {

    this.r =  (3.063218 * this.x - 1.393325 * this.y - 0.475802 * this.z);
    this.g = (-0.969243 * this.x + 1.875966 * this.y + 0.041555 * this.z);
    this.b =  (0.067871 * this.x - 0.228834 * this.y + 1.069251 * this.z);

    return this;

}

function anomylize(a,b) {
    var v = 1.75, d = v * 1 + 1;

    return ([
        (v * b[0] + a[0] * 1) / d,
        (v * b[1] + a[1] * 1) / d,
        (v * b[2] + a[2] * 1) / d
    ]);

}

function monochrome(r) {
    var z = Math.round(r[0] * 0.299 + r[1] * 0.587 + r[2] * 0.114);
    return ([z,z,z]);
}
