"use strict";

var Scope = require("./scope"),
  InjectableType = require("./injectableType"),
  InjectorModule = require("./moduleGroup"),

  isString = require("lodash.isstring");

/**
 * For internal use only.  injector.js exports a global singleton that should be invoked directly.
 * @package
 * @constructor
 */
function Injector() {
  var self = this;

  self.scopes = {};
  self.scopes[Scope.SINGLETON] = {};
  self.scopes[Scope.APPLICATION] = {};

  /**
   * @type {Array.<ModuleGroup>}
   */
  self.moduleGroups = [];

  /**
   * @package
   * @type {Array.<String>}
   */
  self.nameStack = [];

  /**
   * @package
   * @type {Array.<Scope>}
   */
  self.scopeStack = [];
}

/**
 * Make a new module group and add it to the Injector.
 *
 * @param {String} name name of the module group being registered
 * @param {*} moduleDeclarations array containing alternating values of type String and * where the string is the name
 * of an Injectable Module and the * is an object or function that is the subject of the Injectable Module.  It is an
 * error if moduleDeclarations is odd-lengthed or if any of the Injectable Module names are not String types.
 */
Injector.prototype.newModuleGroup = function(name, moduleDeclarations) {
  if(!moduleDeclarations || !moduleDeclarations.length) {
    throw new Error("no moduleDeclarations found");
  }

  if((moduleDeclarations.length & 1)) {
    throw new Error("moduleDeclarations length must be evenly divisible by 2");
  }

  var self = this,
    eagerSingletons = [],
    moduleGroup = new InjectorModule(name),
    moduleName,
    otherGroup,
    i, ii,
    j, jj;

  // add the module prior to registering
  self.addModuleGroup(moduleGroup);

  for(i = 0, ii = moduleDeclarations.length; i < ii; i += 2) {
    moduleName = moduleDeclarations[i];
    if(!isString(moduleName)) {
      throw new Error("string expected at moduleDeclarations[" + i + "]");
    }

    for (j = 0, jj = self.moduleGroups.length; j < jj; j++) {
      otherGroup = self.moduleGroups[j];

      if(otherGroup.getInjectable(moduleName)) {
        if(otherGroup === moduleGroup) {
          throw new Error("Module " + moduleName + " was registered more than once in " + moduleGroup.name +
            " module group");
        }
        else {
          throw new Error("Module " + moduleName + " in module group " + moduleGroup.name + " was already registered " +
            "in another module group " + otherGroup.name);
        }
      }
    }

    var injectable = moduleGroup.register(moduleName, moduleDeclarations[i + 1]);

    if(injectable.scope === Scope.SINGLETON && injectable.eagerInstantiation) {
      eagerSingletons.push(moduleName);
    }
  }

  // instantiate any eager singletons NOW by calling getInstance on the module names
  for(i = 0, ii = eagerSingletons.length; i < ii; i++) {
    this.getInstance(eagerSingletons[i]);
  }
};

Injector.prototype.SINGLETON_SCOPE = 1;
Injector.prototype.APPLICATION_SCOPE = 2;
Injector.prototype.PROTOTYPE_SCOPE = 4;
Injector.prototype.EAGER_FLAG = 128;

/**
 * Annotate a constructor function with metadata that instructs the injector what the scope, injectedParams and
 * other configuration flags should be when it instantiates using that constructor.  With the annotations, the
 * constructor is converted into a proper module that can be added to a module group.
 *
 * @param {Function} ctor constructor function
 * @param {Number=} flags integer containing flags (as set bits) that describe what the scope and configuration flags
 * should be for the constructor
 * @param {...String=} injectedParams injected parameters that need to be constructed into the instance at time of
 * instantiation
 * @returns {Function} annotated constructor function that is suitable to be added as a module to a module group
 * @see {@link Injector#newModuleGroup}
 */
Injector.prototype.annotateConstructor = function(ctor, flags, injectedParams) {
  var argList = Array.from(arguments),
    metaObj = {
      injectedParams: (argList.length > 2) ? argList.slice(2) : [],
      eager: false
    }, i, ii;

  for(i = 0, ii = metaObj.injectedParams.length; i < ii; i++) {
    if(typeof metaObj.injectedParams[i] !== "string") {
      throw new Error("only Strings are expected for injectedParams");
    }
  }

  flags = (typeof flags === "undefined") ? Injector.prototype.PROTOTYPE_SCOPE : flags;

  switch(flags & (Injector.prototype.SINGLETON_SCOPE | Injector.prototype.APPLICATION_SCOPE |
                  Injector.prototype.PROTOTYPE_SCOPE)) {
    case Injector.prototype.PROTOTYPE_SCOPE:
      metaObj.scope = Scope.PROTOTYPE;

      flags -= Injector.prototype.PROTOTYPE_SCOPE;

      break;

    case Injector.prototype.SINGLETON_SCOPE:
      metaObj.scope = Scope.SINGLETON;

      flags -= Injector.prototype.SINGLETON_SCOPE;

      if((flags & Injector.prototype.EAGER_FLAG) === Injector.prototype.EAGER_FLAG) {
        flags -= Injector.prototype.EAGER_FLAG;

        metaObj.eager = true;
      }
      break;

    case Injector.prototype.APPLICATION_SCOPE:
      metaObj.scope = Scope.APPLICATION;

      flags -= Injector.prototype.APPLICATION_SCOPE;

      if((flags & Injector.prototype.EAGER_FLAG) === Injector.prototype.EAGER_FLAG) {
        flags -= Injector.prototype.EAGER_FLAG;

        metaObj.eager = true;
      }
      break;

    default:
      throw new Error("Exactly one scope flag was expected");
  }

  if(flags & Injector.prototype.EAGER_FLAG) {
    throw new Error("Eager flag is only permitted on the SINGLETON and APPLICATION scopes");
  }

  if(flags) {
    throw new Error("Unknown flags");
  }

  ctor["$meta"] = metaObj;

  return ctor;
};

/**
 * Get an instance of named injectable.  If an existing, in-scope object can be found in cache, that instance will be
 * returned rather than a new instance.
 *
 * @param {String} name instance name
 * @returns {Object}
 */
Injector.prototype.getInstance = function(name) {
  return this.getInstanceRecursion(name, this.nameStack, this.scopeStack);
};

/**
 * Recursive internals for getInstance.
 *
 * @private
 * @param {String} name
 * @param {Array.<String>} nameHistory stack of injectable names that are used to prevent circular dependencies
 * @param {Array.<Scope>} scopeHistory stack of scopes that match up with names
 * @returns {Object}
 */
Injector.prototype.getInstanceRecursion = function(name, nameHistory, scopeHistory) {
  if(nameHistory.indexOf(name) != -1) {
    throw new Error("Circular dependencies not allowed.  Detected in dependency graph for Injectable '" +
      nameHistory[0] + "', name history stack: " + nameHistory);
  }

  var self = this,
    injectable, instance, singletonScope,
    i, ii;

  for (i = 0, ii = self.moduleGroups.length; i < ii; i++) {
    injectable = self.moduleGroups[i].getInjectable(name);

    if (!injectable) {
      continue;
    }

    if(scopeHistory.length && scopeHistory[scopeHistory.length-1] < injectable.scope) {
      throw new Error("Cannot inject " + name + " into " + nameHistory[nameHistory.length-1] +
        ", " + name + " has a wider scope.");
    }

    nameHistory.push(name);
    scopeHistory.push(injectable.scope);

    try {
      switch (injectable.scope) {
        case Scope.PROTOTYPE:
          switch (injectable.type) {
            case InjectableType.INJECTED_CONSTRUCTOR:
              return self.newInjectableInstance(injectable, nameHistory, scopeHistory);

            case InjectableType.OBJECT_INSTANCE:
              throw new Error("Not yet implemented");

            default:
              throw new Error("Unknown Injectable type: " + injectable.type);
          }
        case Scope.SINGLETON:
          singletonScope = self.scopes[Scope.SINGLETON];

          if (singletonScope.hasOwnProperty(name)) {
            return singletonScope[name];
          }

          switch (injectable.type) {
            case InjectableType.INJECTED_CONSTRUCTOR:
              instance = self.newInjectableInstance(injectable, nameHistory, scopeHistory);
              break;

            case InjectableType.OBJECT_INSTANCE:
              instance = injectable.subject;
              break;

            default:
              throw new Error("Unknown Injectable type: " + injectable.type);
          }

          singletonScope[name] = instance;

          return instance;

        case Scope.APPLICATION:
          throw new Error("Not implemented");
        default:
          throw new Error("Unknown Injectable scope: " + injectable.scope);
      }
    }
    finally {
      scopeHistory.pop();
      nameHistory.pop();
    }
  }

  throw new Error("Did not find any injectable for: " + name);
};

/**
 * Helper for newModuleGroup.
 *
 * @private
 * @package
 * @param {ModuleGroup} moduleGroup
 */
Injector.prototype.addModuleGroup = function(moduleGroup) {
  var self = this,
    otherModuleGroup,
    i, ii;

  for(i = 0, ii = self.moduleGroups.length; i < ii; i++) {
    otherModuleGroup = self.moduleGroups[i];
    if(otherModuleGroup === moduleGroup) {
      break;
    }
  }

  // did we get to the end of the list without break'ing?
  if(i === ii) {
    self.moduleGroups.push(moduleGroup)
  }
};

/**
 * Used in testing to reset Injector internals.  Do not call.
 *
 * @package
 * @param {Scope} scope
 */
Injector.prototype.clearScope = function(scope) {
  var scopeName;
  for(scopeName in Scope) {
    if(Scope.hasOwnProperty(scopeName) && Scope[scopeName] === scope) {
      this.scopes[scope] = {};
      return;
    }
  }

  throw new Error("Unknown scope: " + scope);
};

/**
 *
 * @package
 * @param {Injectable} injectable
 * @param {Array.<String>} nameHistory
 * @param {Array.<Scope>} scopeHistory
 * @returns {Object}
 */
Injector.prototype.newInjectableInstance = function(injectable, nameHistory, scopeHistory) {
  var j, jj,
    params = [];

  for (j = 0, jj = injectable.injectedParams.length; j < jj; j++) {
    params.push(this.getInstanceRecursion(injectable.injectedParams[j], nameHistory, scopeHistory));
  }

  return injectable.newInstance(params);
};

module.exports = Injector;
