var sinon = require("sinon"),
  _ = require("lodash"),
  expect = require("expectant"),

  Injectable = require("./injectable"),
  InjectableType = require("./injectableType"),
  Scope = require("./scope");

describe("injectable", function() {
  var sandbox = null;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
    sandbox = null;
  });

  it("will fail if the constructor function with args does not have a $meta property", function() {
    /**
     * @param {MyTestClass} myTestClass
     * @constructor
     */
    function MyMissingMetaClass(myTestClass) {
      this.c = "3";
      this.d = "4";
      this.myTestClass = myTestClass;
    }

    expect.throws(function() {
      new Injectable(MyMissingMetaClass, "MyMissingMetaClass");
    }, Error, "expected a valid $meta object property attached to a constructor function that takes parameters");
  });

  it("will fail if a function passed does not have a $meta property", function() {
    function MyMetaNotNeededOnNoArgsClass() {
      this.e = "5";
      this.f = "6";
    }

    expect.throws(function() {
      new Injectable(MyMetaNotNeededOnNoArgsClass, "MyMetaNotNeededOnNoArgsClass");
    }, /function requires a \$meta/, "MyMetaNotNeededOnNoArgsClass does not have any constructor args, and the registration should be allowed to succeed");
  });

  it("will fail if the Injectable does not have a type on the $meta property", function() {
    function MyClass() {
    }

    MyClass["$meta"] = {
    };

    expect.throws(function() {
      new Injectable(MyClass, "MyClass");
    }, /Injectable must specify a type in \$meta/, "MyMetaNotNeededOnNoArgsClass does not have any constructor args, and the registration should be allowed to succeed");
  });

  it("will fail if the INJECTED_CONSTRUCTOR function argument count does not equal length of injectedParams", function() {
    function MyWrongMetaClass(injectMe) {
      this.g = "7";
      this.h = "8";
      this.injectMe = injectMe;
    }

    MyWrongMetaClass["$meta"] = {
      injectedParams: [ "OneThing", "OtherThing" ],
      type: InjectableType.INJECTED_CONSTRUCTOR
    };

    expect.throws(function() {
      new Injectable(MyWrongMetaClass, "MyWrongMetaClass");
    }, /differs from the count of \$meta.injectedParams/, "MyWrongMetaClass constructor args count does not match the $meta.injectedParams length");
  });

  it("will fail if anything other than object or function is passed to constructor", function() {
    expect.throws(function() {
      new Injectable(12345, "should fail");
    }, Error, "Not an object nor function was passed");

    expect.notThrows(function() {
      var injectable = new Injectable(new String("hello world"), "will not fail");

      expect.equals(InjectableType.OBJECT_INSTANCE, injectable.type);
    }, "little caveat because javascript is psycho: typeof new String(...) is 'object'");
  });

  it("will create a new instance of an INJECTED_CONSTRUCTOR with parameters", function() {
    function MyTestClass(param1, param2) {
      this.x = param1;
      this.y = param2;
    }

    MyTestClass["$meta"] = {
      injectedParams: [ "param1", "param2" ],
      type: InjectableType.INJECTED_CONSTRUCTOR,
      scope: Scope.SINGLETON
    };

    var dynamicObjectFactorySpy = sandbox.spy(Injectable.prototype, "createDynamicObjectFactory");
    var injectable = new Injectable(MyTestClass, "MyTestClass");

    var instance = injectable.newInstance([ "abc", 123 ]);
    expect.equals(1, dynamicObjectFactorySpy.callCount, "the object factory was created");
    expect.isTrue(dynamicObjectFactorySpy.returned(injectable.newInstanceFunction), "the instance function was cached");

    expect.isTrue(instance instanceof MyTestClass, "instance was created");
    expect.equals("abc", instance.x, "param1 was assigned in the constructor");
    expect.equals(123, instance.y, "param2 was assigned in the constructor");

    // now try to newInstance again, and the dynamicObjectFactory will be reused rather than re-created
    dynamicObjectFactorySpy.resetHistory();
    var anotherInstance = injectable.newInstance([ "abc", 123 ]);
    expect.equals(0, dynamicObjectFactorySpy.callCount, "the object factory was not recreated");
    expect.notSameReference(instance, anotherInstance, "newInstance did NOT look at scope (caller is expected to do that).  it *always* creates a new instance when called");
  });

  it("[newInstance] will create a new instance of a PROVIDER_FUNCTION with parameters", function() {
    function myProviderFunction(a, b) {
      return a + " " + b;
    }

    myProviderFunction["$meta"] = {
      injectedParams: [ "a", "b" ],
      type: InjectableType.PROVIDER_FUNCTION,
      scope: Scope.PROTOTYPE
    };

    var dynamicObjectFactorySpy = sandbox.spy(Injectable.prototype, "createDynamicObjectFactory");
    var injectable = new Injectable(myProviderFunction, "myProviderFunction");

    var instance = injectable.newInstance([ "hello", "goodbye" ]);
    expect.equals(0, dynamicObjectFactorySpy.callCount, "the object factory was not needed");

    expect.equals("hello goodbye", instance, "param1 was assigned in the constructor");
  });

  it("will throw if non-INJECTED_CONSTRUCTOR type has newInstance called", function() {
    var injectable = new Injectable({}, "a singleton object");

    expect.equals(InjectableType.OBJECT_INSTANCE, injectable.type, "objects are singletons by default");

    expect.throws(function() {
      injectable.newInstance([]);
    }, Error, "Injectable is not instantiable because it is not type INJECTED_CONSTRUCTOR");
  });

  it("[constructor] will set eagerInstantiation to false by default", function() {
    _.forEach([Scope.SINGLETON, Scope.PROTOTYPE], function(aScope) {
      function MyTestClass() {
      }

      MyTestClass["$meta"] = {
        scope: aScope,
        type: InjectableType.INJECTED_CONSTRUCTOR
      };

      var injectable = new Injectable(MyTestClass, "mytestclass");

      expect.isFalse(injectable.eagerInstantiation);
    });
  });

  it("[constructor] will set eagerInstantiation to true when $meta has eager==true for INJECTED_CONSTRUCTOR, PROTOTYPE", function() {
    function MyTestClass() {
    }

    MyTestClass["$meta"] = {
      scope: Scope.SINGLETON,
      type: InjectableType.INJECTED_CONSTRUCTOR,
      eager: true
    };

    var injectable = new Injectable(MyTestClass, "mytestclass");

    expect.isTrue(injectable.eagerInstantiation);
  });

  it("[constructor] function parameter count validations fail if type is INJECTED_CONSTRUCTOR when counts are not exactly equal", function() {
    function LessParamsConstructor(oneParam) {
    }
    LessParamsConstructor["$meta"] = {
      type: InjectableType.INJECTED_CONSTRUCTOR,
      injectedParams: ["oneParam", "twoParam"]
    };

    function MoreParamsConstructor(oneParam, twoParam) {
    }
    MoreParamsConstructor["$meta"] = {
      type: InjectableType.INJECTED_CONSTRUCTOR,
      injectedParams: ["oneParam"]
    };

    _.forEach([LessParamsConstructor, MoreParamsConstructor], function(clazz) {
      expect.throws(function() {
        new Injectable(clazz, "MyClass");
      }, /differs from the count of \$meta.injectedParams/, "throws because counts don't match");
    });

  });

  it("[constructor] function parameter count validations fail if type is PROVIDER_FUNCTION and injectedParams counts is greater than the function param count", function() {
    function LessParamsProvider(oneParam) {
    }

    LessParamsProvider["$meta"] = {
      type: InjectableType.PROVIDER_FUNCTION,
      injectedParams: ["oneParam", "twoParam"]
    };

    expect.throws(function () {
      new Injectable(LessParamsProvider, "LessParamsProvider")
    }, /is less than the count of \$meta.injectedParams/, "A provider function cannot have fewer parameters than \$meta.injectedParams");
  });

  it("[constructor] function parameter count validations will not fail if scope is PROTOTYPE and type is PROVIDER_FUNCTION when injectedParams counts is greater than the function param count (allows for assisted injection)", function() {
    function MoreParamsProvider(oneParam, twoParam) {
    }
    MoreParamsProvider["$meta"] = {
      type: InjectableType.PROVIDER_FUNCTION,
      scope: Scope.PROTOTYPE,
      injectedParams: ["oneParam"]
    };

    expect.notThrows(function() {
      new Injectable(MoreParamsProvider, "MoreParamsProvider")
    }, "A PROTOTYPE-scope provider function can take additional parameters in the function")
  });

  it("[constructor] function parameter count validations will fail if scope is not PROTOTYPE and type is PROVIDER_FUNCTION when injectedParams counts is greater than the function param count (assisted injection only allowed for PROTOTYPE scope)", function() {
    function MoreParamsProvider(oneParam, twoParam) {
    }
    MoreParamsProvider["$meta"] = {
      type: InjectableType.PROVIDER_FUNCTION,
      scope: Scope.SINGLETON,
      injectedParams: ["oneParam"]
    };

    expect.throws(function() {
      new Injectable(MoreParamsProvider, "MoreParamsProvider")
    }, /may not be greater than the count of \$meta.injectedParams/, "A non PROTOTYPE-scope provider function cannot take additional parameters in the function")
  });

  it("[constructor] function validations fail if type is not INJECTED_CONSTRUCTOR or PROVIDER_FUNCTION", function() {
    function DummyFunction() {}

    DummyFunction["$meta"] = {
      type: InjectableType.OBJECT_INSTANCE
    };

    expect.throws(function() {
      new Injectable(DummyFunction, "DummyFunction");
    }, /type must be PROVIDER_FUNCTION or INJECTED_CONSTRUCTOR/, "bad type");
  });
});
