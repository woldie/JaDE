"use strict";

var  expect = require("expectant"),

  InjectableType = require("./injectableType"),
  Scope = require("./scope");

function Injectable(subject, injectableName) {
  var self = this,
    type,
    scope,
    metaObj,
    describedParameters,
    eagerInstantiation = false;

  /**
   * @type {Array.<string>}
   */
  self.injectedParams = [];

  switch(typeof subject) {
    case "function":
      scope = Scope.PROTOTYPE;
      type = InjectableType.INJECTED_CONSTRUCTOR;

      if(!subject.hasOwnProperty("$meta")) {
        if (subject.length) {
          throw new Error("Injectable '" + injectableName + "' constructor function requires a $meta " +
            "property to describe its constructor args");
        }
      }
      else {
        metaObj = subject["$meta"];
        describedParameters = metaObj.injectedParams || [];

        if(metaObj.hasOwnProperty("type")) {
          throw new Error("Injectable may not specify its own type in $meta: " + injectableName);
        }

        if(describedParameters.length != subject.length) {
          throw new Error("Injectable '" + injectableName + "' constructor function argument count " +
            "(" + subject.length + ") differs from the count of $meta.injectedParams " +
            "(" + describedParameters.length + ")");
        }

        Array.prototype.push.apply(self.injectedParams, describedParameters);

        if(metaObj.hasOwnProperty("scope")) {
          scope = metaObj.scope;
        }

        eagerInstantiation = !!metaObj.eager;
      }
      break;

    case "object":
      type = InjectableType.OBJECT_INSTANCE;
      scope = Scope.SINGLETON;
      break;

    default:
      throw new Error("For module " + injectableName + ", subject was expected to be either an object or a " +
        "function.");
  }

  /**
   * @type {InjectableType}
   */
  self.type = type;

  /**
   * @type {Object|Function}
   */
  self.subject = subject;

  /**
   * @type {Scope}
   */
  self.scope = scope;

  /**
   * @package
   * @type {(null|function(params: Array): Object)}
   */
  self.newInstanceFunction = null;

  /**
   * @package
   * @type {String}
   */
  self.name = injectableName;

  /**
   * @package
   * @type {boolean}
   */
  self.eagerInstantiation = eagerInstantiation;
}

/**
 * @package
 * @param {Number} numParams number of parameters that
 * @returns {function(Function, Array.<*>): Object} dynamic object factory function
 */
Injectable.prototype.createDynamicObjectFactory = function(numParams) {
  switch(numParams) {
    case 0:
      return function(ctor, p) {
        return new ctor();
      };
    case 1:
      return function(ctor, p) {
        return new ctor(p[0]);
      };
    case 2:
      return function(ctor, p) {
        return new ctor(p[0], p[1]);
      };
    case 3:
      return function(ctor, p) {
        return new ctor(p[0], p[1], p[2]);
      };
    default:
      var paramStrings = [],
        i;

      for (i = 0; i < numParams; i++) {
        paramStrings.push("p[" + i + "]");
      }

      //noinspection JSValidateTypes
      return eval("(function(ctor, p) { " +
        "return new ctor(" + paramStrings.join(",") + "); " +
      "});");
  }
};

/**
 * Always returns a new instance, regardless of scope value.  should only be called by Injector and not
 * directly.  Behavior undefined for types other than INJECTED_CONSTRUCTOR.
 *
 * @package
 * @param {Array} params
 * @returns {Object}
 */
Injectable.prototype.newInstance = function(params) {
  var self = this;

  if (!self.newInstanceFunction) {
    self.newInstanceFunction = self.createDynamicObjectFactory(params.length);
  }

  return self.newInstanceFunction(self.subject, params);
};

module.exports = Injectable;
