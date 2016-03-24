**fast-pool, A lightweight and fast object pool implementation**

About
=

fast-pool is yet another object pooling for JavaScript.

Q: OMG, why *another*?

A: Because the existing ones didn't meet my demands.

Features
=

**Fast**: fastPool doesn't do fancy magic. It just pools objects. And your object is only one function call away from you when you need it.

**Configurable**: fastPool doesn't only pool plain constructors. It allows you to pass a function that returns your object, whatever it is.

**Clean**: fastPool offers you to clean up dirty objects before putting them back into the pool

Usage
=

Either directly [download fast-pool.min.js](http://jensarps.github.io/fast-pool/dist/fast-pool.min.js), or get it via package managers:

NPM:
```
$ npm install fast-pool
```

Bower:
```
$ bower install fast-pool
```

fastPool comes in UMD format, so you can either include it in a script tag, require it as an AMD module or require it as a CommonJS module.

Once required, it will expose a function (called `fastPool` if linked vie script tag), which has the following signature:

```javascript
var pool = fastPool(options);
```

`options` is an object containing the following properties:

* name (string): The name that identifies this pool
* ctor (function, optional): A constructor, that, when called with the new keyword, returns a new object
* createObject (function, optional): A function that returns a new object
* preAllocate (number, optional, default 0): The number of objects to pre-allocate
* resetObject (function, optional): A function that will turn a used, 'dirty' object into a clean state, will get the used object as first and only argument

You MUST pass either the `ctor` or the `reateObject` property.

Examples
=

```javascript
// create a pool for a given `Vector3` class

var vec3Pool = fastPool({
    name: 'vec3',
    ctor: Vector3,
    preAllocate: 20
});

// get a Vector3 instance from the pool
var vec3 = vec3Pool.transfer();

// when it's no longer needed, return it to the pool
vec3Pool.takeBack(vec3);
```


```javascript
// Extending the example above, but making sure the Vector3 instances are in a clean
// state whenever one is transferred from the pool. The resetObject function is called
// during `takeBack`, before the object is put back into the pool.

var vec3Pool = fastPool({
    name: 'vec3',
    ctor: Vector3,
    preAllocate: 20,
    resetObject: function (vec3) {
        vec3.set(0, 0, 0);
    }
});

// get a Vector3 instance from the pool
var vec3 = vec3Pool.transfer();

// do work, and then back to the pool
vec3.x = 5;
vec3Pool.takeBack(vec3); // before the object is put back into the pool, it gets reset.
```

```javascript
// Create pool of Float32Arrays with a given size. Passing only the constructor does not
// work, as it needs an argument, so using the `createObject` property here instead of `ctor`.

var matrix16Pool = fastPool({
    name: 'matrix4',
    preAllocate: 100,
    createObject: function () {
        return new Float32Array(16);
    }
});
```

```javascript
// Create a pool of complex objects with unknown quantity for runtime, so keep the
// pre-allocation low.
function createTieFighter () {
    var tieFighter = new Fighter({
        type: 'TieFighter',
        AIStrength: 3
    });
    tieFighter.setTarget(player);
    return tieFighter;
}

function resetTieFighter (tieFighter) {
    tieFighter.clearTarget();
    tieFighter.resetPosition();
}

var tieFighterPool = fastPool({
    name: 'TieFighter',
    preAllocate: 5,
    createObject: createTieFighter,
    resetObject: resetTieFighter
});
```

Reference
=

A reference is over here: http://jensarps.github.io/fast-pool/reference/global.html#fastPool

License
=

MIT
