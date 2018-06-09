"use strict";

var Injectable = require("./injectable"),
  isString = require("lodash.isstring");

/**
 * This class is for internal use only.  Use {@link Injector#newModuleGroup} to create a new ModuleGroup.
 *
 * @param {String} name module group name
 * @package
 * @constructor
 */
function ModuleGroup(name) {
  this.name = name;

  this.injectables = {};
}

/**
 * @param {String} injectableName
 * @param {(Function|Object)} subject
 * @returns {Injectable}
 */
ModuleGroup.prototype.register = function(injectableName, subject) {
  if(!isString(injectableName)) {
    throw new Error("Expected first parameter to be a string");
  }
  if(this.injectables.hasOwnProperty(injectableName)) {
    throw new Error(injectableName + " already registered in module group " + this.name);
  }

  var injectable = new Injectable(subject, injectableName);
  this.injectables[injectableName] = injectable;

  return injectable;
};

/**
 * @param {string} name
 * @returns {Injectable|null}
 */
ModuleGroup.prototype.getInjectable = function(name) {
  return this.injectables[name] || null;
};

module.exports = ModuleGroup;
