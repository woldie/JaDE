/**
 * @license
 * JaDE - A roguelike game engine for HTML.
 * <br />Copyright (C) 2018  Woldrich, Inc.
 *
 * <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *   <img alt="Creative Commons License" style="border-width:0"
 *        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
 *   <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *     Creative Commons Attribution-ShareAlike 4.0 International License
 *   </a>.
 */

"use strict";

import $ from "jquery";

require("../stylesheets/scavengers.css");

import { injector } from "jsuice";
import "./jadeModule";

(/** @type {Init} */ injector.getInstance("init")).run();

// TODO: make chunked hot reloading work
//if (module.hot) {
//  module.hot.accept(['./jadeModule.js', './init.js'], function() {
//    console.log("Hot reload ...");
//
//    $(body).empty();
//    injector.reset();
//
//    (/** @type {Init} */ injector.getInstance("init")).run();
//  });
//}
