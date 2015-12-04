# jsColorblindSimulator

Simulate different kinds of color-blindness on images directly in your webbrowser.
All the processing is done locally and the images do not leave your computer.

# Try it [here](http://mapeper.github.io/jsColorblindSimulator/)

## About this project
This project is inspired by [Coblis - the Color BLIndness Simulator](http://www.color-blindness.com/coblis-color-blindness-simulator/).
But instead of uploading the images to a server it does all the image processing locally in your webbrowser.

You can choose between 2 different Simulation Algorithms *(Both are not proven to produce good or realistic results!)*:

##### The `ColorMatrix` Algorithm

From http://www.colorjack.com/labs/colormatrix/ [(web.archive)](http://web.archive.org/web/20081014161121/http://www.colorjack.com/labs/colormatrix/).

But there is [this comment](http://kaioa.com/node/75#comment-247) which claims to be from the author:
> You're right, the ColorMatrix version is very simplified, and not accurate. I created that color matrix one night (http://www.colorjack.com/labs/colormatrix/)
and since then it's shown up many places... I should probably take that page down before it spreads more! Anyways, it gives you an idea of what it might look
like, but for the real thing...
>
> As far as a simple script to simulate color blindness, this one does the best job:
>
> [http://www.nofunc.com/Color_Blindness_Library/] — It uses "confusion lines" within the XYZ color space to calculate values (this one is in Javascript, and should be easy to convert to python).
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
