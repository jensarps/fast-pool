/*global define,module */

/**
 * @license fastPool - A lightweight and fast object pool implementation
 *
 * Version 0.9.0
 *
 * Copyright (c) 2016 Jens Arps
 * http://jensarps.de/
 *
 * Licensed under the MIT license
 */

(function (name, definition, global) {

    'use strict';

    if (typeof define === 'function') {
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    } else {
        global[name] = definition();
    }
})('fastPool', function () {

    'use strict';

    /**
     * The Pool constructor. When calling `fastPool()`, an instance of `Pool` will be returned.
     * 
     * @exports Pool
     *
     * @param options
     * @param {function} options.createObject A function that returns a new object
     * @param {number} options.preAllocate The number of objects to pre-allocate
     * @param {function} [options.resetObject] A function that will turn a used, dirty object into a clean state
     * @constructor
     */
    var Pool = function (options) {
        this.createObject = options.createObject;
        this.resetObject = options.resetObject;
        this.preAllocate(options.preAllocate);
    };

    Pool.prototype = /** @lends {Pool} */ {

        constructor: Pool,

        /**
         * A function that returns a new object.
         *
         * @type {function}
         */
        createObject: null,

        /**
         * A function that will turn a used, dirty object into a clean state.
         *
         * @type {function}
         */
        resetObject: null,

        /**
         * The actual object pool.
         *
         * @private
         */
        _pool: [],

        /**
         * Pre-allocates the pool to the given size.
         *
         * @param {number} size The amount of objects to pre-allocate
         */
        preAllocate: function (size) {
            while (size--) {
                this._pool.push(this.createObject());
            }
        },

        /**
         * Removes an object from the pool and hands it over to the caller. If the pool is empty, will create a new
         * object.
         *
         * @returns {*} An object
         */
        transfer: function () {
            var pool = this._pool;
            return pool.length ? pool.pop() : this.createObject();
        },

        /**
         * Takes back an object and puts it back into the pool. If a `resetObject` function is given, it will be
         * executed with the given object as first and only argument.
         *
         * @param {*} object The object to put back into the pool.
         */
        takeBack: function (object) {
            if (this.resetObject) {
                this.resetObject(object);
            }
            this._pool.push(object);
        },

        /**
         * Makes sure that the pool has at least the given size.
         *
         * @param {number} size
         */
        ensureSize: function (size) {
            var diff = size - this._pool.length;
            if (diff > 0) {
                this.preAllocate(diff);
            }
        }
    };

    /**
     * The map of pools. Singleton.
     *
     * @type {Object<string, Pool>}
     * @private
     */
    var _pools = {};

    /**
     * Returns an object pool identified with the given name. If no pool with the given name exists, it will create a
     * new pool.
     *
     *
     * @example
     *  // create a pool for a given `Vector3` class
     *  
     *  var vec3Pool = fastPool({
     *      name: 'vec3',
     *      ctor: Vector3,
     *      preAllocate: 20
     *  });
     *  
     *  // get a Vector3 instance from the pool
     *  var vec3 = vec3Pool.transfer();
     *  
     *  // when it's no longer needed, return it to the pool
     *  vec3Pool.takeBack(vec3);
     * 
     * @example
     *  // Extending the example above, but making sure the Vector3 instances are in a clean
     *  // state whenever one is transferred from the pool. The resetObject function is called
     *  // during `takeBack`, before the object is put back into the pool.
     *
     *  var vec3Pool = fastPool({
     *      name: 'vec3',
     *      ctor: Vector3,
     *      preAllocate: 20,
     *      resetObject: function (vec3) {
     *          vec3.set(0, 0, 0);
     *      }
     *  });
     *
     *  // get a Vector3 instance from the pool
     *  var vec3 = vec3Pool.transfer();
     *
     *  // do work, and then back to the pool
     *  vec3.x = 5;
     *  vec3Pool.takeBack(vec3); // before the object is put back into the pool, it gets reset.
     *
     *
     * @example
     *  // Create pool of Float32Arrays with a given size. Passing only the constructor does not
     *  // work, as it needs an argument, so using the `createObject` property here instead of `ctor`.
     *
     *  var matrix16Pool = fastPool({
     *      name: 'matrix4',
     *      preAllocate: 100,
     *      createObject: function () {
     *          return new Float32Array(16);
     *      }
     *  });
     *
     * @example
     *  // Create a pool of complex objects with unknown quantity for runtime, so keep the
     *  // pre-allocation low.
     *
     *  var tieFighterPool = fastPool({
     *      name: 'TieFighter',
     *      preAllocate: 5,
     *      createObject: function () {
     *          var tieFighter = new Fighter({
     *              type: 'TieFighter',
     *              AIStrength: 3
     *          });
     *          tieFighter.setTarget(player);
     *          return tieFighter;
     *      },
     *      resetObject: function (tieFighter) {
     *          tieFighter.clearTarget();
     *          tieFighter.resetPosition();
     *      }
     *  });
     *
     *
     * @version 1.0.0
     * @type {function}
     * @alias fastPool
     *
     * @param {object} options
     * @param {string} options.name The name that identifies this pool
     * @param {function} [options.ctor] A constructor, that, when called with the new keyword, returns a new object
     * @param {function} [options.createObject] A function that returns a new object
     * @param {number} [options.preAllocate=0] The number of objects to pre-allocate
     * @param {function} [options.resetObject] A function that will turn a used, 'dirty' object into a clean state
     * @returns {Pool} An object pool
     */
    function fastPool(options) {

        if (!options || !options.name) {
            throw new Error('fastPool: No `name` property given.');
        }

        if (!options.ctor && !options.createObject) {
            throw new Error('fastPool: Neither `ctor` nor `createObject` property given.');
        }

        options.preAllocate = options.preAllocate || 0;

        var pool = _pools[options.name];

        if (typeof pool !== 'undefined') {
            pool.ensureSize(options.preAllocate);
            return pool;
        }

        options.createObject = options.createObject ||
            function () {
                return new options.ctor();
            };

        pool = _pools[options.name] = new Pool(options);

        return pool;
    }

    return fastPool;

}, this);
