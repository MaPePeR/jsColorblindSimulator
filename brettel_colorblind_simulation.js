// Code adapted from libDaltonLens https://daltonlens.org (public domain)

function linearRGB_from_sRGB(v)
{
    var fv = v / 255.0;
    if (fv < 0.04045) return fv / 12.92;
    return Math.pow((fv + 0.055) / 1.055, 2.4);
}

function sRGB_from_linearRGB(v)
{
    if (v <= 0.) return 0;
    if (v >= 1.) return 255;
    if (v < 0.0031308) return 0.5 + (v * 12.92 * 255);
    return 0 + 255 * (Math.pow(v, 1.0 / 2.4) * 1.055 - 0.055);
}

var brettelFunctions = {
    Normal: function (v) { return (v); },
    Protanopia: function (v) { return brettel(v, 'protan', 1.0); },
    Protanomaly: function (v) { return brettel(v, 'protan', 0.6); },
    Deuteranopia: function (v) { return brettel(v, 'deutan', 1.0); },
    Deuteranomaly: function (v) { return brettel(v, 'deutan', 0.6); },
    Tritanopia: function (v) { return brettel(v, 'tritan', 1.0); },
    Tritanomaly: function (v) { return brettel(v, 'tritan', 0.6); },
    Achromatopsia: function (v) { return monochrome_with_severity(v, 1.0); },
    Achromatomaly: function (v) { return monochrome_with_severity(v, 0.6); }
};

var sRGB_to_linearRGB_Lookup = Array(256);
(function () {
    var i;
    for (i = 0; i < 256; i++) {
        sRGB_to_linearRGB_Lookup[i] = linearRGB_from_sRGB(i);
    }

})();

var LMS_from_linearRGB = Array(
    0.17886, 0.43997, 0.03597,
    0.03380, 0.27515, 0.03621,
    0.00031, 0.00192, 0.01528
);

var linearRGB_from_LMS = Array(
    8.00533, -12.88195, 11.68065,
    -0.97821, 5.26945, -10.18300,
    -0.04017, -0.39885, 66.48079
);

brettel_params = {
    protan: {
        lmsElementToProject: 0, // only this LMS coordinate is affected for protan
        projectionOnPlane1: [0.00000, 2.18394, -5.65554],
        projectionOnPlane2: [0.00000, 2.16614, -5.30455],
        separationPlaneNormal: [0.00000, 0.01751, -0.34516]
    },

    deutan: {
        lmsElementToProject: 1, // only this LMS coordinate is affected for protan
        projectionOnPlane1: [0.46165, 0.00000, 2.44885],
        projectionOnPlane2: [0.45789, 0.00000, 2.58960],
        separationPlaneNormal: [-0.01751, 0.00000, 0.65480]
    },

    tritan: {
        lmsElementToProject: 2, // only this LMS coordinate is affected for protan
        projectionOnPlane1: [-0.00213, 0.05477, 0.00000],
        projectionOnPlane2: [-0.06195, 0.16826, 0.00000],
        separationPlaneNormal: [0.34516, -0.65480, 0.00000]
    },
};


function brettel(srgb, t, severity) {
    // Go from sRGB to linearRGB
    var rgb = Array(3);
    rgb[0] = sRGB_to_linearRGB_Lookup[srgb[0]]
    rgb[1] = sRGB_to_linearRGB_Lookup[srgb[1]]
    rgb[2] = sRGB_to_linearRGB_Lookup[srgb[2]]
    
    // lms = LMS_from_linearRGB * rgb
    var lms = Array(3);
    lms[0] = LMS_from_linearRGB[0]*rgb[0] + LMS_from_linearRGB[1]*rgb[1] + LMS_from_linearRGB[2]*rgb[2];
    lms[1] = LMS_from_linearRGB[3]*rgb[0] + LMS_from_linearRGB[4]*rgb[1] + LMS_from_linearRGB[5]*rgb[2];
    lms[2] = LMS_from_linearRGB[6]*rgb[0] + LMS_from_linearRGB[7]*rgb[1] + LMS_from_linearRGB[8]*rgb[2];

    var params = brettel_params[t];
    var separationPlaneNormal = params['separationPlaneNormal'];
    var projectionOnPlane1 = params['projectionOnPlane1'];
    var projectionOnPlane2 = params['projectionOnPlane2'];
    var lmsElementToProject = params['lmsElementToProject'];

    // Check on which plane we should project by comparing wih the separation plane normal.
    var dotWithSepPlane = lms[0]*separationPlaneNormal[0] + lms[1]*separationPlaneNormal[1] + lms[2]*separationPlaneNormal[2];
    var projectionOnPlane = (dotWithSepPlane >= 0 ? projectionOnPlane1 : projectionOnPlane2);

    // Project on the plane. Only one coordinate changes (the axis corresponding
    // to the missing cone cells), so no need to perform a full 3x3 multiplication.
    // The severity factor is implemented as a linear interpolation with the original value.
    var projected_element = projectionOnPlane[0]*lms[0] + projectionOnPlane[1]*lms[1] + projectionOnPlane[2]*lms[2];
    lms[lmsElementToProject] = (projected_element*severity) + (lms[lmsElementToProject]*(1.0-severity));

    // Go back to linear RGB
    // rgb_cvd = linearRGB_from_LMS * lms
    rgb[0] = linearRGB_from_LMS[0]*lms[0] + linearRGB_from_LMS[1]*lms[1] + linearRGB_from_LMS[2]*lms[2];    
    rgb[1] = linearRGB_from_LMS[3]*lms[0] + linearRGB_from_LMS[4]*lms[1] + linearRGB_from_LMS[5]*lms[2];
    rgb[2] = linearRGB_from_LMS[6]*lms[0] + linearRGB_from_LMS[7]*lms[1] + linearRGB_from_LMS[8]*lms[2];

    return ([sRGB_from_linearRGB(rgb[0]),sRGB_from_linearRGB(rgb[1]),sRGB_from_linearRGB(rgb[2])]);
}

// Adjusted from the hcirn code
function monochrome_with_severity(srgb, severity) {
    var z = Math.round(srgb[0] * 0.299 + srgb[1] * 0.587 + srgb[2] * 0.114);
    var r = z*severity + (1.0-severity)*srgb[0];
    var g = z*severity + (1.0-severity)*srgb[1];
    var b = z*severity + (1.0-severity)*srgb[2];
    return ([r,g,b]);
}
