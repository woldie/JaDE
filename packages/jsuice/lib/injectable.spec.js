var sinon = require("sinon"),
  _ = require("lodash"),
  expect = require("expectant"),

  Injectable = require("./injectable"),
  InjectableType = require("./injectableType"),
  Scope = require("./scope");

describe("injectable", function() {
  var sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
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

  it("will fail if the constructor argument count does not equal length of injectedParams", function() {
    function MyWrongMetaClass(injectMe) {
      this.g = "7";
      this.h = "8";
      this.injectMe = injectMe;
    }

    MyWrongMetaClass["$meta"] = {
      injectedParams: [ "OneThing", "OtherThing" ]
    };

    expect.throws(function() {
      new Injectable(MyWrongMetaClass, "MyWrongMetaClass");
    }, Error, "MyWrongMetaClass constructor args count does not match the $meta.injectedParams length");
  });

  it("will not fail if the constructor function without args does not have a $meta property", function() {
    function MyMetaNotNeededOnNoArgsClass() {
      this.e = "5";
      this.f = "6";
    }

    expect.notThrows(function() {
      new Injectable(MyMetaNotNeededOnNoArgsClass, "MyMetaNotNeededOnNoArgsClass");
    }, "MyMetaNotNeededOnNoArgsClass does not have any constructor args, and the registration should be allowed to succeed");
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
        scope: aScope
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
      eager: true
    };

    var injectable = new Injectable(MyTestClass, "mytestclass");

    expect.isTrue(injectable.eagerInstantiation);
  });
});
