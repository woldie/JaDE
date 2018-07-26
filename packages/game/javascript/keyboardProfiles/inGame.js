/**
 * The standard in-game profile for navigating the world.
 */
export default [
  {name: "hero up", combo: "up", repeating: false,
    keyDown: function() { cosmos.playerState.up = true; },
    keyUp: function() { cosmos.playerState.up = false; }},
  {name: "hero down", combo: "down", repeating: false,
    keyDown: function() { cosmos.playerState.down = true; },
    keyUp: function() { cosmos.playerState.down = false; }},
  {name: "hero left", combo: "left", repeating: false,
    keyDown: function() { cosmos.playerState.left = true; },
    keyUp: function() { cosmos.playerState.left = false; }},
  {name: "hero right", combo: "right", repeating: false,
    keyDown: function() { cosmos.playerState.right = true; },
    keyUp: function() { cosmos.playerState.right = false; }},
  {name: "hero climb", combo: "c", repeating: false,
    keyDown: function() { },
    keyUp: function() { cosmos.commands.climb = true; }},
  {name: "pop to next area", combo: "p", repeating: true,
    keyDown: function() { },
    keyUp: function() { cosmos.commands.popToNextArea = true; }}
];
