"use strict";

var expect = require("expectant"),

  Injector = require("./injector"),
  Scope = require("./scope"),
  InjectorModule = require("./moduleGroup"),
  InjectableType = require("./injectableType");

describe("injector", function() {
  var module,
    /** @type {Injector} */ injector;

  beforeEach(function() {
    injector = new Injector();

    injector.clearScope(Scope.SINGLETON);
    injector.clearScope(Scope.APPLICATION);
    injector.moduleGroups = [];

    module = new InjectorModule("myModule");
  });

  it("[addModuleGroup] will register a module", function() {
    injector.addModuleGroup(module);

    expect.equals(1, injector.moduleGroups.length, "should have gotten a module");
    expect.isSameReference(module, injector.moduleGroups[0], "should be the one we added");
  });

  it("[addModuleGroup] will not allow you to register the same module twice", function() {
    injector.addModuleGroup(module);
    injector.addModuleGroup(module);

    expect.equals(1, injector.moduleGroups.length, "should have only one module in there");
  });

  it("[PROTOTYPE, CONSTRUCTOR_FUNCTION] will instantiate successfully", function() {
    function MyConstructor() {
      this.a = 123;
    }
    injector.annotateConstructor(MyConstructor);

    module.register("MyConstructor", MyConstructor);

    injector.addModuleGroup(module);

    var newPrototypeScopeInstance = injector.getInstance("MyConstructor");
    expect.isNotNull(newPrototypeScopeInstance);
    expect.isTrue(newPrototypeScopeInstance instanceof MyConstructor);
    expect.equals(123, newPrototypeScopeInstance.a);

    var anotherPrototypeScopeInstance = injector.getInstance("MyConstructor");
    expect.isNotNull(anotherPrototypeScopeInstance);
    expect.notEquals(anotherPrototypeScopeInstance, newPrototypeScopeInstance);
  });

  it("[PROTOTYPE, CONSTRUCTOR_FUNCTION] will instantiate with an injection", function() {
    function MyConstructor() {
      this.a = 123;
    }
    injector.annotateConstructor(MyConstructor);

    module.register("MyConstructor", MyConstructor);

    function MyConstructorWithInjection(otherObject) {
      this.injectedObject = otherObject;
    }

    injector.annotateConstructor(MyConstructorWithInjection, injector.PROTOTYPE_SCOPE, "MyConstructor");

    module.register("MyConstructorWithInjection", MyConstructorWithInjection);

    injector.addModuleGroup(module);
    var objectWithInjection = injector.getInstance("MyConstructorWithInjection");

    expect.isTrue(objectWithInjection instanceof MyConstructorWithInjection, "outer object is correct type");
    expect.isTrue(objectWithInjection.injectedObject instanceof MyConstructor, "inner object is correct type");
  });

  it("[PROTOTYPE, CONSTRUCTOR_FUNCTION] will throw an error if there are any circular dependencies", function() {
    function MyConstructor(myOtherObject) {
      this.a = myOtherObject;
    }

    injector.annotateConstructor(MyConstructor, injector.PROTOTYPE_SCOPE, "MyOtherConstructor");

    module.register("MyConstructor", MyConstructor);

    function MyOtherConstructor(otherObject) {
      this.injectedObject = otherObject;
    }

    injector.annotateConstructor(MyOtherConstructor, injector.PROTOTYPE_SCOPE, "MyConstructor");

    module.register("MyOtherConstructor", MyOtherConstructor);

    injector.addModuleGroup(module);

    expect.throws(function() {
      injector.getInstance("MyConstructor");
    }, /Circular dependencies/, "Circular dependencies between Injectables should throw");
  });

  it("[SINGLETON, CONSTRUCTOR_FUNCTION] will instantiate once and only once", function() {
    function MyConstructor() {
      this.a = 123;
    }

    injector.annotateConstructor(MyConstructor, injector.SINGLETON_SCOPE);

    module.register("MyConstructor", MyConstructor);

    var injectable = module.getInjectable("MyConstructor");
    expect.equals(Scope.SINGLETON, injectable.scope);

    injector.addModuleGroup(module);

    var objectA = injector.getInstance("MyConstructor");
    var objectB = injector.getInstance("MyConstructor");

    expect.isSameReference(objectA, objectB, "singleton object should be returned for objectA and objectB");
  });

  it("[SINGLETON, CONSTRUCTOR_FUNCTION] will not inject dependencies with wider scopes (any other than SINGLETON)", function() {
    function MyPrototype() {
    }

    injector.annotateConstructor(MyPrototype, injector.PROTOTYPE_SCOPE);

    module.register("MyPrototype", MyPrototype);

    function MySingleton(myPrototype) {
      this.x = myPrototype;
    }

    injector.annotateConstructor(MySingleton, injector.SINGLETON_SCOPE, "MyPrototype");

    module.register("MySingleton", MySingleton);

    injector.addModuleGroup(module);

    expect.throws(function() {
      injector.getInstance("MySingleton");
    }, /wider scope/, "Cannot bind a singleton to a wider-scoped dependency");
  });

  it("[PROTOTYPE, CONSTRUCTOR_FUNCTION] will not inject dependencies from wider scopes than PROTOTYPE", function() {
    console.log("TODO, need application scope to do this test")
  });

  it("[SINGLETON, OBJECT_INSTANCE] will be injected as a dependency into a CONSTRUCTOR_FUNCTION Injectable", function() {
    var anObject = {
      x: 123
    };

    module.register("anObject", anObject);

    function MyConstructor(myObject) {
      this.myObject = myObject;
    }

    injector.annotateConstructor(MyConstructor, injector.PROTOTYPE_SCOPE, "anObject");

    module.register("MyConstructor", MyConstructor);

    injector.addModuleGroup(module);

    var instance = injector.getInstance("MyConstructor");

    expect.isSameReference(anObject, instance.myObject, "the OBJECT_INSTANCE singleton got referenced");

    var anotherInstance = injector.getInstance("MyConstructor");

    expect.isSameReference(anObject, anotherInstance.myObject, "the OBJECT_INSTANCE injected really is a singleton");
  });

  it("[SINGLETON, PROVIDER_FUNCTION] will instantiate once and only once", function() {
    var number = 0;
    function providerFunction() {
      number++;
      return "this should always be a 1: " + number;
    }

    injector.annotateProvider(providerFunction, injector.SINGLETON_SCOPE);

    module.register("providedObject", providerFunction);

    function MyConstructorWithInjection(otherObject) {
      this.injectedObject = otherObject;
    }

    injector.annotateConstructor(MyConstructorWithInjection, injector.PROTOTYPE_SCOPE, "providedObject");

    module.register("MyConstructorWithInjection", MyConstructorWithInjection);

    injector.addModuleGroup(module);
    var objectWithInjection = injector.getInstance("MyConstructorWithInjection");

    expect.isTrue(objectWithInjection instanceof MyConstructorWithInjection, "outer object is correct type");
    expect.equals("this should always be a 1: 1", objectWithInjection.injectedObject, "inner object is the singleton string");

    var anotherObjectWithInjection = injector.getInstance("MyConstructorWithInjection");

    expect.isTrue(anotherObjectWithInjection instanceof MyConstructorWithInjection, "outer object is correct type");
    expect.equals("this should always be a 1: 1", anotherObjectWithInjection.injectedObject, "inner object is the singleton string we already created");
  });

  it("[PROTOTYPE, PROVIDER_FUNCTION] will instantiate every time", function() {
    var number = 0;
    function providerFunction() {
      number++;
      return "this should always change: " + number;
    }

    injector.annotateProvider(providerFunction, injector.PROTOTYPE_SCOPE);

    module.register("providedObject", providerFunction);

    function MyConstructorWithInjection(otherObject) {
      this.injectedObject = otherObject;
    }

    injector.annotateConstructor(MyConstructorWithInjection, injector.PROTOTYPE_SCOPE, "providedObject");

    module.register("MyConstructorWithInjection", MyConstructorWithInjection);

    injector.addModuleGroup(module);
    var objectWithInjection = injector.getInstance("MyConstructorWithInjection");

    expect.isTrue(objectWithInjection instanceof MyConstructorWithInjection, "outer object is correct type");
    expect.equals("this should always change: 1", objectWithInjection.injectedObject, "inner object is a unique string");

    var anotherObjectWithInjection = injector.getInstance("MyConstructorWithInjection");

    expect.isTrue(anotherObjectWithInjection instanceof MyConstructorWithInjection, "outer object is correct type");
    expect.equals("this should always change: 2", anotherObjectWithInjection.injectedObject, "inner object is another unique string");
  });

  it("[PROTOTYPE, PROVIDER_FUNCTION] will instantiate with additional parameters", function() {
    function MyConstructor() {
      this.x = 123;
    }

    injector.annotateConstructor(MyConstructor, injector.SINGLETON_SCOPE);

    module.register("MyConstructor", MyConstructor);

    function providerFunction(myConstructedObj, extraParam1, extraParam2) {
      return "three things: " + myConstructedObj.x + " " + extraParam1 + " " + extraParam2;
    }

    injector.annotateProvider(providerFunction, injector.PROTOTYPE_SCOPE, "MyConstructor");

    module.register("providedObject", providerFunction);
    injector.addModuleGroup(module);

    var assistedInject = injector.getInstance("providedObject", "abc", "xyz");

    expect.equals("three things: 123 abc xyz", assistedInject, "assisted injection worked");
  });

  it("[newInstance] additional parameters fail with an error when type isnt provider function", function() {
    function MyConstructor() {
      this.x = 123;
    }

    injector.annotateConstructor(MyConstructor, injector.SINGLETON_SCOPE);

    module.register("MyConstructor", MyConstructor);
    injector.addModuleGroup(module);

    expect.throws(function() {
      injector.getInstance("MyConstructor", "abc", "xyz");
    }, /Add'l parameters only allowed for getInstance when target injectable is a provider function/, "not a provider");
  });

  it("[newInstance] additional parameters will fail with an error when arg counts don't combine to the expected count", function() {
    function MyConstructor() {
      this.x = 123;
    }

    injector.annotateConstructor(MyConstructor, injector.SINGLETON_SCOPE);

    module.register("MyConstructor", MyConstructor);

    function providerFunction(myConstructedObj, extraParam1, extraParam2) {
      return "three things: " + myConstructedObj.x + " " + extraParam1 + " " + extraParam2;
    }

    injector.annotateProvider(providerFunction, injector.PROTOTYPE_SCOPE, "MyConstructor");

    module.register("providedObject", providerFunction);
    injector.addModuleGroup(module);

    expect.throws(function() {
      injector.getInstance("providedObject", "abc", "xyz", "ONE TOO MANY");
    }, /counts did not match/, "one too many additional args");
  });

  it("[newModuleGroup] will simultaneously add a group of injectables to an ModuleGroup -and- add that module to the Injector", function() {
    var anObject = {
      x: 123
    };

    function MyConstructor(myObject) {
      this.myObject = myObject;
    }

    injector.annotateConstructor(MyConstructor, injector.PROTOTYPE_SCOPE, "anObject");

    injector.newModuleGroup("myGroup", [
      "MyConstructor", MyConstructor,
      "anObject", anObject
    ]);

    var myConstructedObj = injector.getInstance("MyConstructor");

    expect.isTrue(myConstructedObj instanceof MyConstructor, "constructed prototype is expected instanceof");
    expect.deepEquals(anObject, myConstructedObj.myObject, "singleton object is same contents");
    expect.isTrue(anObject === myConstructedObj.myObject, "singleton object is same reference");
  });

  it("[newModuleGroup] will error if your module uses the same name more than once", function() {
    function MyConstructor() {
    }
    injector.annotateConstructor(MyConstructor);

    function OtherConstructor() {
    }
    injector.annotateConstructor(OtherConstructor);

    expect.throws(function() {
      injector.newModuleGroup("myGroup", [
        "MyConstructor", MyConstructor,
        "MyConstructor", OtherConstructor
      ]);
    }, /Module MyConstructor was registered more than once in myGroup module group/);
  });

  it("[newModuleGroup] will error if your module uses the same name more than once across module groups", function() {
    function MyConstructor() {
    }
    injector.annotateConstructor(MyConstructor);

    function OtherConstructor() {
    }
    injector.annotateConstructor(OtherConstructor);

    injector.newModuleGroup("otherGroup", [
      "MyConstructor", MyConstructor
    ]);

    expect.throws(function() {
      injector.newModuleGroup("myGroup", [
        "MyConstructor", OtherConstructor
      ]);
    }, /Module MyConstructor in module group myGroup was already registered in another module group otherGroup/);
  });

  it("[newModuleGroup] will eager instantate when an eager singleton module is registered in a module group", function() {
    var constructorCalled = false;

    function MyConstructor() {
      constructorCalled = true;
    }

    injector.annotateConstructor(MyConstructor, injector.SINGLETON_SCOPE | injector.EAGER_FLAG);

    injector.newModuleGroup("otherGroup", [
      "MyConstructor", MyConstructor
    ]);

    expect.isTrue(constructorCalled, "The constructor was called for the singleton");
  });

  it("[annotateConstructor] will populate the $meta object with flags and injectedParams and return constructor", function() {
    function MyConstructor(gazinta, another) {
      this.gazinta = gazinta;
      this.another = another;
    }

    var annotatedCtor = injector.annotateConstructor(MyConstructor, injector.SINGLETON_SCOPE | injector.EAGER_FLAG, "gazinta", "another");

    expect.isSameReference(annotatedCtor, MyConstructor, "the returned constructor is the same reference as the one passed in");
    expect.isDefined(MyConstructor["$meta"], "$meta was added to the constructor");
    expect.equals(InjectableType.INJECTED_CONSTRUCTOR, MyConstructor["$meta"].type, "type is correct");
    expect.equals(Scope.SINGLETON, MyConstructor["$meta"].scope, "singleton scope set");
    expect.isTrue(MyConstructor["$meta"].eager, "eager flag set");
    expect.deepEquals([ "gazinta", "another" ], MyConstructor["$meta"].injectedParams, "injected params set");
  });

  it("[annotateConstructor] will be a prototype scope if no additional parameters are supplied", function() {
    function MyConstructor() {
    }

    injector.annotateConstructor(MyConstructor);  // no extra parameters applied

    expect.equals(Scope.PROTOTYPE, MyConstructor["$meta"].scope, "prototype scope set");
    expect.isFalse(MyConstructor["$meta"].eager, "eager flag unset");
    expect.deepEquals([ ], MyConstructor["$meta"].injectedParams, "empty injected params set");
  });

  it("[annotateConstructor] will throw if a non-string appears in injectedParams", function() {
    function MyConstructor(blah) {
      this.blah = blah;
    }

    expect.throws(function() {
      injector.annotateConstructor(MyConstructor, injector.SINGLETON_SCOPE, /not a string/);
    }, /Strings are expected/, "should throw when non-strings appear for injectedParams")
  });

  it("[annotateConstructor] will fail if a scope is not set or if more than one scope is set", function() {
    [ 0,
      injector.SINGLETON_SCOPE | injector.PROTOTYPE_SCOPE,
      injector.APPLICATION_SCOPE | injector.PROTOTYPE_SCOPE,
      injector.SINGLETON_SCOPE | injector.APPLICATION_SCOPE,
      injector.SINGLETON_SCOPE | injector.APPLICATION_SCOPE | injector.PROTOTYPE_SCOPE
    ].forEach(function(flags) {
      function MyConstructor() {
      }

      expect.throws(function() {
        injector.annotateConstructor(MyConstructor, flags);
      }, /exactly one scope flag/i, "Expect annotateConstructor to throw when flags does not contain exactly one scope");
    });
  });

  it("[annotateConstructor] will allow eager to be set to true only on SINGLETON or APPLICATION", function() {
    [
      injector.SINGLETON_SCOPE,
      injector.APPLICATION_SCOPE
    ].forEach(function(flags) {
      function MyConstructor() {
      }

      expect.notThrows(function() {
        injector.annotateConstructor(MyConstructor, flags | injector.EAGER_FLAG);
      }, "The annotation with eager flag set should succeed");

      expect.isTrue(MyConstructor["$meta"].eager, "eager flag is set");
    });
  });

  it("[annotateConstructor] will fail if eager flag is set on scopes that do not support eager instantiation", function() {
    function MyConstructor() {
    }

    expect.throws(function() {
      injector.annotateConstructor(MyConstructor, injector.PROTOTYPE_SCOPE | injector.EAGER_FLAG);
    }, /Eager flag/, "Eager flag is not supported with the PROTOTYPE scope");
  });

  it("[annotateConstructor] will fail if junk flags are detected", function() {
    function MyConstructor() {
    }

    expect.throws(function() {
      injector.annotateConstructor(MyConstructor, injector.APPLICATION_SCOPE | injector.EAGER_FLAG | 4096);
    }, /Unknown flags/, "Will throw if unknown flags are detected");
  });

  it("[annotateProvider] will set $meta with all the appropriate values", function() {
    annotateProviderHappyPath(injector.APPLICATION_SCOPE | injector.EAGER_FLAG, true, Scope.APPLICATION);
    annotateProviderHappyPath(injector.APPLICATION_SCOPE, false, Scope.APPLICATION);
  });

  it("[annotateProvider] will set $meta with all the appropriate values for SINGLETON_SCOPE", function() {
    annotateProviderHappyPath(injector.SINGLETON_SCOPE | injector.EAGER_FLAG, true, Scope.SINGLETON);
    annotateProviderHappyPath(injector.SINGLETON_SCOPE, false, Scope.SINGLETON);
  });

  it("[annotateProvider] will set $meta with all the appropriate values for PROTOTYPE_SCOPE", function() {
    annotateProviderHappyPath(injector.PROTOTYPE_SCOPE, false, Scope.PROTOTYPE);
  });

  it("[annotateProvider] will throw if PROTOTYPE_SCOPE and eager flag is set", function() {
    function providerFunction(xyz) {}

    expect.throws(function() {
      injector.annotateProvider(providerFunction, injector.PROTOTYPE_SCOPE | injector.EAGER_FLAG, "xyz", "abc");
    }, /Eager flag cannot be used with PROTOTYPE_SCOPE/, "eager flag incompatible");
  });

  function annotateProviderHappyPath(flags, eagerExpected, expectedScope) {
    function providerFunction(xyz) {}

    var result = injector.annotateProvider(providerFunction, flags, "xyz", "abc");

    expect.isSameReference(result, providerFunction, "The annotated provider function is returned");
    expect.isDefined(result["$meta"], "$meta was set");
    expect.deepEquals([ "xyz", "abc" ], result["$meta"].injectedParams, "injected params set");
    expect.equals(InjectableType.PROVIDER_FUNCTION, result["$meta"].type, "type is correct");
    expect.equals(expectedScope, result["$meta"].scope, "application scope set");
    expect.equals(eagerExpected, result["$meta"].eager, "eager flag");
  }
});
