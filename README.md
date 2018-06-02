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

    INKLECATE_COMPILER=c:\Users\davew\Inky\resources\app.asar.unpacked\main-process\ink\inkjs-compatible\inklecate_win.exe
    
In my Linux environment, this environment variable was set to:

    INKLECATE_COMPILER=~/Inky_linux/Inky-linux-x64/resources/app.asar.unpacked/main-process/ink/inkjs-compatible/inklecate_win.exe

On Linux, the Wine emulator must be used to run inklecate_win.exe.  Make sure Wine is installed before trying to run 
the JaDE build scripts.

    sudo dnf install wine.x86_64

## Tiled editor

I built [Tiled](https://github.com/bjorn/tiled) from source.  In my Linux environment, I followed the instructions for 
Fedora:

    sudo dnf builddep tiled
    qmake-qt5
    make

## Node.js tooling

Node.js and npm are used to host the JaDE build tools.  Please ensure you have a recent version of Node.js and npm
installed.  I use the Node Version Manager (nvm) to do this.  

On Linux, follow [these instructions](https://github.com/creationix/nvm#installation) for installing nvm.  

On Windows, use [Chocolatey](https://chocolatey.org/) to install nvm on your computer:

    choco install nvm

Then use nvm to install the current version of Node.js and nvm for your local:

    nvm alias default node
    nvm install-latest-npm

JaDE's build scripts use command-line tools that run atop Node.js and npm to build the JaDE engine along with all data 
files that make up your game's content.  Use these commands before attempting to build JaDE:

    npm install --global gulp-cli
    npm install --global lerna
    lerna bootstrap

Any time you need to edit any of the `package.json` files in the `game` folder or other folders, you must run 
`lerna bootstrap` again.

# Building JaDE

We provide a 'hot' development mode that automatically rebuilds and reloads files as you edit and save them in your 
tools:

    lerna run dev

The progress of JavaScript unit tests and Inklecate compilations can be observed on the command-line.  And, you may 
visit an auto-updating copy of your running JaDE game at:  {COMING SOON}.  If the auto-update function does not work,
you can always hit Refresh on your browser.

If you want to build a distribution of your game, run:

    lerna run {COMING SOON}
    
And all of the compiled files you need to play your game will be saved to the `dist` folder.
