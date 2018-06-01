# JaDE
Justin and Dave's Engine - A 2D Game Engine

# Installing

Download a copy of Inky from [https://github.com/inkle/inky/releases](https://github.com/inkle/inky/releases)
and unzip to a folder on your local.  Inky is an editor that you can use to edit .ink files found in your 
game project.  For more information on Inky and Ink, checkout the [homepage](https://www.inklestudios.com/ink/)

The Inky editor also ships with a command-line compiler called inklecate that the build scripts need.  You need
to find the inkle-js editor and make an environment variable that points to the inkjs_compatible windows .exe.
In my Windows environment, this environment variable was set to:

    INKLECATE_COMPILER=c:\Users\davew\Inky\resources\app.asar.unpacked\main-process\ink\inkjs-compatible\inklecate_win.exe
    
In my Linux environment, this environment variable was set to:

    INKLECATE_COMPILER=~/Inky_linux/Inky-linux-x64/resources/app.asar.unpacked/main-process/ink/inkjs-compatible/inklecate_win.exe

On Linux, Wine will be used to run inklecate_win.exe.  Make sure Wine is installed before trying to build the code.

    npm install --global gulp-cli
    npm install --global lerna
    lerna bootstrap

# Building

