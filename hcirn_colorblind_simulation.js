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
    var gamma = 2.2;
    var wx = 0.312713;
    var wy = 0.329016;
    var wz = 0.358271;

    var b = rgb[2];
    var g = rgb[1];
    var r = rgb[0];

    var cr = powGammaLookup[r];
    var cg = powGammaLookup[g];
    var cb = powGammaLookup[b];
    // rgb -> xyz
    var cx = (0.430574 * cr + 0.341550 * cg + 0.178325 * cb);
    var cy = (0.222015 * cr + 0.706655 * cg + 0.071330 * cb);
    var cz = (0.020183 * cr + 0.129553 * cg + 0.939180 * cb);

    var sum_xyz = cx + cy + cz;
    var cu = 0;
    var cv = 0;

    if (sum_xyz != 0) {
        cu = cx / sum_xyz;
        cv = cy / sum_xyz;
    }

    var nx = wx * cy / wy;
    var nz = wz * cy / wy;
    var clm;
    var dy = 0;

    if (cu < rBlind[t].cpu) {
        clm = (rBlind[t].cpv - cv) / (rBlind[t].cpu - cu);
    } else {
        clm = (cv - rBlind[t].cpv) / (cu - rBlind[t].cpu);
    }

    var clyi = cv - cu * clm;
    var du = (rBlind[t].ayi - clyi) / (clm - rBlind[t].am);
    var dv = (clm * du) + clyi;

    var sx = du * cy / dv;
    var sy = cy;
    var sz = (1 - (du + dv)) * cy / dv;
    // xzy->rgb
    var sr =  (3.063218 * sx - 1.393325 * sy - 0.475802 * sz);
    var sg = (-0.969243 * sx + 1.875966 * sy + 0.041555 * sz);
    var sb =  (0.067871 * sx - 0.228834 * sy + 1.069251 * sz);

    var dx = nx - sx;
    var dz = nz - sz;
    // xzy->rgb
    dr =  (3.063218 * dx - 1.393325 * dy - 0.475802 * dz);
    dg = (-0.969243 * dx + 1.875966 * dy + 0.041555 * dz);
    db =  (0.067871 * dx - 0.228834 * dy + 1.069251 * dz);

    var adjr = dr ? ((sr < 0 ? 0 : 1) - sr) / dr : 0;
    var adjg = dg ? ((sg < 0 ? 0 : 1) - sg) / dg : 0;
    var adjb = db ? ((sb < 0 ? 0 : 1) - sb) / db : 0;

    var adjust = Math.max(
        ((adjr > 1 || adjr < 0) ? 0 : adjr),
        ((adjg > 1 || adjg < 0) ? 0 : adjg),
        ((adjb > 1 || adjb < 0) ? 0 : adjb)
    );

    sr = sr + (adjust * dr);
    sg = sg + (adjust * dg);
    sb = sb + (adjust * db);

    return ([inversePow(sr),inversePow(sg),inversePow(sb)]);

}

function inversePow(v) {
    return (255 * (v <= 0 ? 0 : v >= 1 ? 1 : Math.pow(v, 1 / 2.2)));
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
