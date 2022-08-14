# jsColorblindSimulator

Simulate different kinds of color-blindness on images directly in your webbrowser.
All the processing is done locally and the images do not leave your computer.

# Try it [here](http://mapeper.github.io/jsColorblindSimulator/)

## About this project
This project is inspired by [Coblis - the Color BLIndness Simulator](http://www.color-blindness.com/coblis-color-blindness-simulator/).
But instead of uploading the images to a server it does all the image processing locally in your webbrowser.

You can choose between 4 different Simulation Algorithms *(The first two are not proven to produce good or realistic results!)*:

##### The `ColorMatrix` Algorithm

From http://www.colorjack.com/labs/colormatrix/ [(web.archive)](http://web.archive.org/web/20081014161121/http://www.colorjack.com/labs/colormatrix/).

But there is [this comment](http://kaioa.com/node/75#comment-247) which claims to be from the author:
> You're right, the ColorMatrix version is very simplified, and not accurate. I created that color matrix one night (http://www.colorjack.com/labs/colormatrix/)
and since then it's shown up many places... I should probably take that page down before it spreads more! Anyways, it gives you an idea of what it might look
like, but for the real thing...
>
> As far as a simple script to simulate color blindness, this one does the best job:
>
> http://www.nofunc.com/Color_Blindness_Library/ — It uses "confusion lines" within the XYZ color space to calculate values (this one is in Javascript, and should be easy to convert to python).
>
> There are a few other methods, and no one really knows exactly what it would look like... these are all generalizations of a small sample, set against the masses.

##### The HCIRN Color Blind Simulation function
From http://www.nofunc.com/Color_Blindness_Library/ [(web.archive)](http://web.archive.org/web/20090318054431/http://www.nofunc.com/Color_Blindness_Library).

    The Color Blind Simulation function is
    copyright (c) 2000-2001 by Matthew Wickline and the
    Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

    It is used with the permission of Matthew Wickline and HCIRN,
    and is freely available for non-commercial use. For commercial use, please
    contact the Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

##### The Brettel, Viénot and Mollon Simulation function

This is an implementation of the research paper [_Computerized simulation of color appearance for dichromats_](http://vision.psychol.cam.ac.uk/jdmollon/papers/Dichromatsimulation.pdf) by Brettel, H., Viénot, F., & Mollon, J. D. (1997). It has been adapted to modern sRGB monitors and should be pretty accurate, at least for full dichromacy. Of course it is still an approximation though, many factors make it imperfect, such as uncalibrated monitor, unknown lighting environment, and per-individual variations. In general it will tend to be accurate for small or thin objects (small dots, lines) and too strong for large bright areas, even for full dichromats.

##### Gustavo M. Machado, Manuel M. Oliveira, and Leandro A. F. Fernandes

Uses the matrizes published on https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
from the paper
> Gustavo M. Machado, Manuel M. Oliveira, and Leandro A. F. Fernandes _"A Physiologically-based Model for Simulation of Color Vision Deficiency"_. *IEEE Transactions on Visualization and Computer Graphics.* Volume 15 (2009), Number 6, November/December 2009. pp. 1291-1298.
