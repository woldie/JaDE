# Scavengers ep 1 - The quest for T.C.

Next steps:

* Scene to scroll
* Center on player sprite
* Make prototype overworld
* Teleport



















# JaDE - a Roguelike game engine and creative tools


We will develop the following systems for the engine (in priority order):

* Scripted conversations between the player and NPC's and storytelling text
  ([Ink scripting language](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md).)
* Handcrafted dungeon editing ([Tiled map editor](https://www.mapeditor.org/)?)
    * Tileset definitions developed and loaded here to be used for random maps as well as handcrafted dungeon maps
* High-speed tiled graphics renderer ([PixiJS](http://www.pixijs.com/)?)
* Pathfinding for enemies to find and attack the player 
  ([Pathfinding.js](https://github.com/qiao/PathFinding.js)-based?)
* Randomized dungeon generation ([node-roguelike](https://github.com/tlhunter/node-roguelike), 
  [dungeon-o-matic](https://github.com/cleggatt/dungeon-o-matic), [ROguelike Toolkit](https://github.com/ondras/rot.js),
  or maybe custom code based on the above if nothing out in the wild suits.)
* Custom Adlib Gold simulation to provide for music and/or sound effects

## Todos

* inkjs / Inky
    * Get to know Inky and write a little Ink dialogue and run it out of the browser
    * Build a simple game loop where each paragraph and set of choices is displayed interleaved with javascripted 
      processing
    * Document the game loop and how states move from Javascript to Ink session variables and back again
    * Write up a little howto on writing Ink and how it interfaces with the system

## Potential housekeeping tasks

* In `packages/game/gulpfile.js`, there is a gulp watcher for compiling .ink files to inkly .json files.  This could 
  be integrated directly into the webpack tasks there as a custom Webpack Loader.  Consider writing a .ink --> .json
  Webpack Loader and removing the gulp watcher.
  
