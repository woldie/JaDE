# JaDE
Justin and Dave's Engine - A 2D Game Engine
<br />(C) 2018, Woldrich, Inc.

Licensed under the 
[Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/legalcode) 
license.

# Installing Tools

To create your JaDE game, you will need tools for creation:

* Inky
* Tiled

And, you will need compilation tools:

* JavaScript build tools:  nvm, Node.js, npm, lerna, gulp, ...
* Inklecate compiler
* Tiled command line compiler tools

## Inky editor

JaDE uses Inky for editing dialogue files.  It also uses a windows application embedded in the Inky folders to 
compile the .ink files you edit and save with Inky into .json files that JaDE will be able to load at runtime.

Download a copy of Inky from [https://github.com/inkle/inky/releases](https://github.com/inkle/inky/releases)
and unzip to a folder on your local.  Inky is an editor that you can use to edit .ink files found in your 
game project.  For more information on Inky and Ink, checkout the [homepage](https://www.inklestudios.com/ink/)

On Linux, the mono-devel package may need to be installed for the Inky app for the preview panel to function:

    sudo dnf install mono-devel.x86_64

### Inklecate compiler

The Inky editor also ships with a command-line compiler called inklecate that the build scripts need.  You need
to find the Inky editor on your file system and make an environment variable that points to the inkjs_compatible 
windows .exe.  In my Windows environment, this environment variable was set to:

    INKLECATE_COMPILER=C:/Progra~1/Inky-win32-x64/resources/app.asar.unpacked/main-process/ink/inkjs-compatible/inklecate_win.exe
    
In my Linux environment, this environment variable was set to:

    INKLECATE_COMPILER=~/Inky_linux/Inky-linux-x64/resources/app.asar.unpacked/main-process/ink/inkjs-compatible/inklecate_win.exe

On Linux, the Wine windows emulator must be installed to run inklecate_win.exe.  Make sure Wine is installed before
trying to run the JaDE build scripts.

    sudo dnf install wine.x86_64

## Tiled editor

I built [Tiled](https://github.com/bjorn/tiled) from source.  In my Linux environment, I followed the instructions for 
Fedora:

    sudo dnf builddep tiled
    qmake-qt5
    make

Your Linux package manager may also have a prebuilt Tiled package you can install.  The Tiled website has downloadable
installers for Windows systems.

## Installing Node.js

Node.js and npm are used to host the JaDE build tools.  Please ensure you have a recent version of Node.js and npm
installed.

On Windows, the best you can do currently is to download a current version of Node from https://nodejs.org for Windows

On Linux, I use the Node Version Manager (nvm) to manage the Node installations I have on my local.  Follow
[these instructions](https://github.com/creationix/nvm#installation) for installing nvm.

Then use nvm to install the current version of Node.js and nvm for your local:

    nvm alias default node
    nvm install-latest-npm

## Additional Node tooling

JaDE's build scripts use command-line tools that run atop Node.js and npm to build the JaDE engine along with all data 
files that make up your game's content.  Use these commands before attempting to build JaDE:

    npm install --global gulp-cli
    npm install --global lerna
    lerna bootstrap

NOTE:  Any time you edit any `package.json` files in the `game` folder or other folders, you must run
`lerna bootstrap` again.

# Building JaDE

We provide a 'hot' development mode that automatically rebuilds and reloads files as you edit and save them in your 
text editor and creation tools:

    lerna run dev

The progress of JavaScript unit tests and Inklecate compilations can be observed on the command-line.  And, you may 
visit an auto-updating copy of your running JaDE game on your local at:  {COMING SOON}.  If the auto-update function
does not work, you can always hit Refresh on your browser.

If you want to build a distribution of your game, run:

    lerna run {COMING SOON}
    
And all of the compiled files you need to play your game will be saved to the `dist` folder.

# Game Development Recipes

## Creating a handmade area map
 
* In Tiled, select File | New ...
  * In the New dialog, select `Orthogonal`, `CSV`, `Right Down`, and then set your map height and width to the desired
    size and the pixel height/width of the tiles in the map to 16x16.
* In the Tilesets pane, create a new tileset by loading a .png containing your tile graphics.  Your .png should be 384 
  pixels wide (24 tiles in width) and some multiple of 16 pixels high.
  * By convention, save your tileset .png files and any other javascript or JSON related to each tileset to the 
    tilesets/ folder.
* When saving your handmade area maps from Tiled, use File | Save ...
  * In the Save dialog, use the dropdown for indicating file format and select `JSON Map Files`.
  * By convention, save your map JSON files to the maps/ folder.
