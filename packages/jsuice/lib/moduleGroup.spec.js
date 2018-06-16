"use strict";

var expect = require("expectant"),

  ModuleGroup = require("./moduleGroup"),
  Scope = require("./scope"),
  InjectableType = require("./injectableType");

function MyTestClass() {
  this.a = "1";
  this.b = "2";
}

MyTestClass["$meta"] = {
  injectedParams: [],
  type: InjectableType.INJECTED_CONSTRUCTOR
};

function MyGoodMetaClass(inject1, inject2) {
  this.inject1 = inject1;
  this.inject2 = inject2;
}

MyGoodMetaClass["$meta"] = {
  injectedParams: [ "InjectOne", "InjectTwo" ],
  type: InjectableType.INJECTED_CONSTRUCTOR
};

function MyBusyMetaClass(inject1) {
  this.inject1 = inject1;
}

MyBusyMetaClass["$meta"] = {
  injectedParams: [ "InjectOne" ],
  type: InjectableType.INJECTED_CONSTRUCTOR,
  scope: Scope.PROTOTYPE
};

describe("ModuleGroup", function() {
  var moduleGroup;

  beforeEach(function() {
    moduleGroup = new ModuleGroup("myInjector");
  });

  it("will allow you to register a constructor function", function() {
    moduleGroup.register("MyTestClass", MyTestClass);

    var injectable = moduleGroup.getInjectable("MyTestClass");
    expect.equals(InjectableType.INJECTED_CONSTRUCTOR, injectable.type, "when you provide a function to register(), it automatically assigns INJECTED_CONSTRUCTOR to type");
    expect.equals(Scope.PROTOTYPE, injectable.scope, "Default scope");
    expect.deepEquals([], injectable.injectedParams, "Default empty args list") ;
    expect.isSameReference(MyTestClass, injectable.subject, "injectable found by name");
  });

  it("will not allow you to register a constructor function under a name that's already taken", function() {
    moduleGroup.register("MyTestClass", MyTestClass);

    expect.throws(function() {
      moduleGroup.register("MyTestClass", MyTestClass);
    }, Error, "can't register a name in the moduleGroup more than once");
  });

  it("will succeed when constructor arg and injectedParams list counts match", function() {
    expect.notThrows(function() {
      moduleGroup.register("MyGoodMetaClass", MyGoodMetaClass);
    }, "MyGoodMetaClass has equal injectedParams and constructor arg counts");
  });

  it("[register] will create a injectable when I get a successful registration and register it with the group", function() {
    var injectable = moduleGroup.register("MyGoodMetaClass", MyGoodMetaClass);

    expect.isSameReference(injectable, moduleGroup.getInjectable("MyGoodMetaClass"), "register returns same object as getInjectable");

    expect.isNotNull(injectable);
    expect.equals(Scope.PROTOTYPE, injectable.scope, "Default is PROTOTYPE when not specified in $meta");
    expect.deepEquals([ "InjectOne", "InjectTwo" ], injectable.injectedParams);
    expect.isSameReference(MyGoodMetaClass, injectable.subject);
    expect.equals(InjectableType.INJECTED_CONSTRUCTOR, injectable.type, "register makes this type when subject is a function");
  });

  it("will create an injectable with all $meta components parsed when I get a successful registration", function() {
    moduleGroup.register("MyBusyMetaClass", MyBusyMetaClass);
    var injectable = moduleGroup.getInjectable("MyBusyMetaClass");

    expect.isNotNull(injectable);
    expect.equals(Scope.PROTOTYPE, injectable.scope);
    expect.deepEquals([ "InjectOne" ], injectable.injectedParams);
    expect.isSameReference(MyBusyMetaClass, injectable.subject);
    expect.equals(InjectableType.INJECTED_CONSTRUCTOR, injectable.type);
  });

  it("will create an injectable for a singleton object if an object is passed to register", function() {
    var anObject = { "abc": 123 };

    moduleGroup.register("anObject", anObject);

    var injectable = moduleGroup.getInjectable("anObject");

    expect.isNotNull(injectable);
    expect.equals(Scope.SINGLETON, injectable.scope, "when you provide an object to register(), it automatically assigns singleton scope");
    expect.deepEquals([], injectable.injectedParams, "no injected/constructor params");
    expect.isSameReference(anObject, injectable.subject);
    expect.equals(InjectableType.OBJECT_INSTANCE, injectable.type, "when you provide an object to register(), it automatically assigns OBJECT_INSTANCE to type");
  });

  it("will throw if the first parameter is not a string", function() {
    expect.throws(function() {
      moduleGroup.register([ 'this is an array, not a string' ], {});
    }, /Expected first parameter to be a string/);
  });

  it("[getInjectable] will return null when an injectable is not found", function() {
    expect.equals(null, moduleGroup.getInjectable("not a registered thing"));
  });
});
