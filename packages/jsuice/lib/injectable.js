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
      if(!subject.hasOwnProperty("$meta")) {
        throw new Error("Injectable '" + injectableName + "' function requires a $meta " +
          "property to describe how it should be invoked.  See injector#annotateConstructor or " +
          "injector#annotateProvider for details.");
      }
      metaObj = subject["$meta"];

      scope = Scope.PROTOTYPE;
      if(metaObj.hasOwnProperty("scope")) {
        scope = metaObj.scope;
      }

      describedParameters = metaObj.injectedParams || [];

      if(!metaObj.hasOwnProperty("type")) {
        throw new Error("Injectable must specify a type in $meta: " + injectableName);
      }

      type = metaObj.type;

      switch(type) {
        case InjectableType.INJECTED_CONSTRUCTOR:
          if(describedParameters.length != subject.length) {
            throw new Error("Injectable '" + injectableName + "' constructor function argument count " +
              "(" + subject.length + ") differs from the count of $meta.injectedParams " +
              "(" + describedParameters.length + ")");
          }
          break;
        case InjectableType.PROVIDER_FUNCTION:
          if(describedParameters.length > subject.length) {
            throw new Error("Injectable '" + injectableName + "' constructor function argument count " +
              "(" + subject.length + ") is less than the count of $meta.injectedParams " +
              "(" + describedParameters.length + ")");
          }
          else if(scope !== Scope.PROTOTYPE && describedParameters.length < subject.length) {
            throw new Error("Non-PROTOTYPE Injectable '" + injectableName + "' constructor function argument count " +
              "(" + subject.length + ") may not be greater than the count of $meta.injectedParams " +
              "(" + describedParameters.length + ")");
          }
          break;
        default:
          throw new Error("$meta.type must be PROVIDER_FUNCTION or INJECTED_CONSTRUCTOR, was (" +
            type + ")");
      }

      Array.prototype.push.apply(self.injectedParams, describedParameters);

      eagerInstantiation = !!metaObj.eager;
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

  if (self.type === InjectableType.PROVIDER_FUNCTION) {
    var passedParamsCount = params.length,
      expectedParamsCount = self.subject.length;

    if(expectedParamsCount > passedParamsCount) {
      throw new Error("Injectable provider " + self.name + " expected " + expectedParamsCount + " arguments, " +
        "but " + passedParamsCount + " were passed.  If " + self.name + " expected addtional arguments " +
        "to be passed, then it must not be used as an injected dependency of another injectable and may only be " +
        "instantiated via a direct call to getInstance() with additional parameters passed.");
    }

    return self.subject.apply(null, params);
  }

  if (!self.newInstanceFunction) {
    self.newInstanceFunction = self.createDynamicObjectFactory(params.length);
  }

  return self.newInstanceFunction(self.subject, params);
};

module.exports = Injectable;
